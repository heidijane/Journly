using Microsoft.EntityFrameworkCore;
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

        public User GetByFirebaseUserId(string firebaseUserId)
        {
            return _context.User
                .Include(u => u.UserType)
                .FirstOrDefault(u => u.FirebaseUserId == firebaseUserId);
        }

        public User GetByUserId(int id)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT u.Id, u.FirebaseUserId, u.FirstName, u.LastName, u.NickName, 
                               u.Birthday, u.Email, u.Avatar, u.CreateDate, u.UserTypeId,
                               t.Id AS TherapistId, t.Verified, t.Company, t.Code,
                               ut.Name AS userTypeName
                        FROM [User] u
                        FULL OUTER JOIN Therapist t ON u.Id = t.UserId
                        JOIN UserType ut ON u.UserTypeId = ut.Id
                        WHERE u.Id = @id
                    ";

                    cmd.Parameters.AddWithValue("@id", id);

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        User user = new User
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            FirebaseUserId = reader.GetString(reader.GetOrdinal("FirebaseUserId")),
                            FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                            LastName = reader.GetString(reader.GetOrdinal("LastName")),
                            NickName = reader.GetString(reader.GetOrdinal("NickName")),
                            Birthday = reader.GetDateTime(reader.GetOrdinal("Birthday")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            Avatar = ReaderUtils.GetNullableString(reader, "Avatar"),
                            CreateDate = reader.GetDateTime(reader.GetOrdinal("CreateDate")),
                            UserTypeId = reader.GetInt32(reader.GetOrdinal("UserTypeId"))
                        };

                        UserType userType = new UserType
                        {
                            Id = user.UserTypeId,
                            Name = reader.GetString(reader.GetOrdinal("UserTypeName"))
                        };

                        user.UserType = userType;

                        if (user.UserTypeId == 1)
                        {
                            Therapist therapist = new Therapist
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("TherapistId")),
                                UserId = reader.GetInt32(reader.GetOrdinal("Id")),
                                Verified = reader.GetBoolean(reader.GetOrdinal("Verified")),
                                Company = reader.GetString(reader.GetOrdinal("Company")),
                                Code = reader.GetString(reader.GetOrdinal("Code"))
                            };

                            user.TherapistInfo = therapist;
                        }                        

                        reader.Close();
                        return user;
                    }
                    else
                    {
                        reader.Close();
                        return null;
                    }
                }
            }
        }

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


        public void AddClient(User user, int therapistId)
        {
            _context.Add(user);
            _context.SaveChanges();

            //create a new user relationship between the user and the therapist
            UserRelationship userRel = new UserRelationship
            {
                TherapistId = therapistId,
                ClientId = user.Id,
                StartDate = DateTime.Now
            };
            _context.Add(userRel);
            _context.SaveChanges();
        }

    }
}
