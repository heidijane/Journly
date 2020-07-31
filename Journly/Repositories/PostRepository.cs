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

        public Post GetById(int id)
        {
            return _context.Post
                        .Include(p => p.Therapist)
                        .Include(p => p.Mood)
                        .Include(p => p.User)
                        .FirstOrDefault(p => p.Id == id);
        }

        public List<Post> GetPostsByUserId(int id, int limit, int start)
        {
            var query = _context.Post
                        .Include(p => p.Therapist)
                        .Include(p => p.Mood)
                        .Where(p => p.UserId == id)
                        .OrderByDescending(p => p.CreateDate)
                        .Skip(start);
            return limit > 0
                ? query.Take(limit).ToList()
                : query.ToList();
        }

        public List<Post> GetPostsByUserIdAndDate(int id, DateTime date)
        {
            return _context.Post
                        .Include(p => p.Therapist)
                        .Include(p => p.Mood)
                        .Where
                        (
                            p => p.UserId == id && 
                            date.Date == p.CreateDate.Date
                        )
                        .OrderBy(p => p.CreateDate)
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

        public void Add(Post post)
        {
            _context.Add(post);
            _context.SaveChanges();
        }

        public void Update(Post post)
        {
            _context.Entry(post).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public Post MostRecentPost(int id)
        {
            return _context.Post
                        .Include(p => p.Mood)
                        .Where(p => p.Deleted == false)
                        .OrderByDescending(p => p.CreateDate)
                        .FirstOrDefault(p => p.UserId == id);
        }

        public List<Post> UnreadPostsByUser(int id, int limit, int start)
        {
            var query = _context.Post
                            .Include(p => p.Mood)
                            .Where(p => p.ViewTime == null)
                            .Where(p => p.UserId == id)
                            .Where(p => p.Deleted == false)
                            .Skip(start);
            return limit > 0
                    ? query.Take(limit).ToList()
                    : query.ToList();
        }

        public List<Post> UnreadPostsByTherapist(int id, int limit, int start)
        {
            var query = (from p in _context.Post
                         join ur in _context.UserRelationship on p.UserId equals ur.UserId
                         where ur.TherapistId == id
                         where p.ViewTime == null
                         where p.Deleted == false
                         select p
                        ).Include(p => p.Mood).Skip(start);
            List<Post> posts =  limit > 0
                                ? query.Take(limit).ToList()
                                : query.ToList();
            return posts;
        }

        public int CountUnreadByUser(int id)
        {
            return _context.Post
                        .Where(p => p.ViewTime == null)
                        .Where(p => p.Deleted == false)
                        .Count(p => p.UserId == id);     
        }

        public int CountUnreadByTherapist(int id)
        {
            int count = (from p in _context.Post
                         join ur in _context.UserRelationship on p.UserId equals ur.UserId
                         where ur.TherapistId == id
                         where p.ViewTime == null
                         where p.Deleted == false
                         select p.Id
                        ).Count();
            return count;
        }

    }
}
