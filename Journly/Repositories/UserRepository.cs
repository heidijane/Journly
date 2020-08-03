﻿using Microsoft.EntityFrameworkCore;
using System.Linq;
using Journly.Data;
using Journly.Models;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;

namespace Journly.Repositories
{
    public class UserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly string _connectionString;

        public UserRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");

        }

        public SqlConnection Connection
        {
            get { return new SqlConnection(_connectionString); }
        }

        //returns a single user by their firebase UID
        public User GetByFirebaseUserId(string firebaseUserId)
        {
            return _context.User
                .Include(u => u.UserType)
                .Include(u => u.TherapistInfo)
                .Include(u => u.UserRelationship)
                .FirstOrDefault(u => u.FirebaseUserId == firebaseUserId);
        }

        //returns a single user by their user ID
        public User GetByUserId(int id)
        {
            return _context.User
                .Include(u => u.UserType)
                .Include(u => u.TherapistInfo)
                .Include(u => u.UserRelationship)
                .FirstOrDefault(u => u.Id == id);
        }

        //determines if a userId has a specific therapist, returns true or false
        public bool IsTherapistForUser(int userId, int currentUserId)
        {
            bool result = _context.UserRelationship.Any(ur => ur.UserId == userId && ur.TherapistId == currentUserId);
            return result;
        }

        //gets therapist info to be used to verify therapist for client registration
        public TherapistConfirmationInfo GetByCounselorCode(string cCode)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT u.Id, u.FirstName, u.LastName, u.NickName, u.Avatar,
                               t.Verified, t.Company
                        FROM [User] u
                        JOIN Therapist t ON u.Id = t.UserId
                        WHERE t.Code = @code
                    ";

                    cmd.Parameters.AddWithValue("@code", cCode);

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        TherapistConfirmationInfo therapistConfirmationInfo = new TherapistConfirmationInfo
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                            LastName = reader.GetString(reader.GetOrdinal("LastName")),
                            NickName = reader.GetString(reader.GetOrdinal("NickName")),
                            Avatar = ReaderUtils.GetNullableString(reader, "Avatar"),
                            Verified = reader.GetBoolean(reader.GetOrdinal("Verified")),
                            Company = reader.GetString(reader.GetOrdinal("Company")),
                            Code = cCode
                        };

                        reader.Close();
                        return therapistConfirmationInfo;
                    }
                    else
                    {
                        reader.Close();
                        return null;
                    }
                }
            }
        }

        //add a new client or therapist to the db
        public void Add(User user)
        {
            _context.Add(user);
            _context.SaveChanges();
        }

    }
}
