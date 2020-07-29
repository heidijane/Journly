using Microsoft.EntityFrameworkCore;
using System.Linq;
using Journly.Data;
using Journly.Models;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace Journly.Repositories
{
    public class PostRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly string _connectionString;

        public PostRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");

        }

        public SqlConnection Connection
        {
            get { return new SqlConnection(_connectionString); }
        }

        public List<Post> GetPostsByUserId(int id)
        {
            return _context.Post
                .Include(p => p.Therapist)
                .Include(p => p.Mood)
                .Where(p => p.UserId == id)
                .OrderByDescending(p => p.CreateDate)
                .ToList();
            
        }

        public List<Post> GetPostsByTherapistId(int id)
        {
            using (SqlConnection conn = Connection)
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT p.Id, p.UserId, p.CreateDate, p.MoodId,
                               p.Content, p.EditTime, p.Flagged, p.TherapistId,
                               p.ViewTime, p.Comment, p.Deleted
                        FROM Post p
                        JOIN UserRelationship ur ON p.UserId = ur.UserId
                        WHERE ur.TherapistId = id
                    ";

                    cmd.Parameters.AddWithValue("@id", id);

                    SqlDataReader reader = cmd.ExecuteReader();

                    List<Post> posts = new List<Post>();
                    while (reader.Read())
                    {
                        Post post = new Post
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            CreateDate = reader.GetDateTime(reader.GetOrdinal("CreateDate")),
                            MoodId = reader.GetInt32(reader.GetOrdinal("MoodId")),
                            Content = ReaderUtils.GetNullableString(reader, "Content"),
                            EditTime = ReaderUtils.GetNullableDateTime(reader, "EditTime"),
                            Flagged = reader.GetBoolean(reader.GetOrdinal("Flagged")),
                            TherapistId = ReaderUtils.GetNullableInt(reader, "TherapistId"),
                            ViewTime = ReaderUtils.GetNullableDateTime(reader, "ViewTime"),
                            Comment = ReaderUtils.GetNullableString(reader, "Ccomment"),
                            Deleted = reader.GetBoolean(reader.GetOrdinal("Deleted"))
                        };

                        posts.Add(post);
                    }

                    reader.Close();

                    return posts;
                }
            }
        }

    }
}
