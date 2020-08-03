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
                        .Include(p => p.User)
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
                        .Include(p => p.User)
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
                            .Include(p => p.User)
                            .Where(p => p.ViewTime == null)
                            .Where(p => p.UserId == id)
                            .Where(p => p.Deleted == false)
                            .OrderByDescending(p => p.Flagged)
                            .ThenByDescending(p => p.CreateDate)
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
                        ).Include(p => p.Mood)
                         .Include(p => p.User)
                         .OrderByDescending(p => p.Flagged)
                         .ThenByDescending(p => p.CreateDate)
                         .Skip(start);
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

        //the monster query! Search through the journal posts by many variables
        //Hey, entity framework isn't so bad after all...?
        public List<Post> Search(int? therapistId = null, int? clientId = null, bool? viewed = null, bool? flagged = null, bool orderDesc = true, int limit = 0, int start = 0)
        {
            //create a blank query for us to add onto
            IQueryable<Post> query;

            //if we want to search by a specific client then let's just do a simple where
            if (clientId != null)
            {
                query = _context.Post
                            .Where(p => p.UserId == clientId);
            } else
            {
                //if we want to search by therapist Id we will do a query syntax join
                query = (from p in _context.Post
                            join ur in _context.UserRelationship on p.UserId equals ur.UserId
                            where ur.TherapistId == therapistId
                            select p
                            );
            }

            //we need to include the mood data and the user data
            query = query.Include(p => p.Mood)
                         .Include(p => p.User);

            //if viewed is not null let's add a condition for getting uread/unread posts
            if (viewed == true)
            {
                query = query.Where(p => p.ViewTime != null);
            } else if (viewed == false)
            {
                query = query.Where(p => p.ViewTime == null);
            }

            //if flagged is not null let's add a condition for getting flagged/unflagged posts
            if (flagged != null)
            {
                query = query.Where(p => p.Flagged == flagged);
            }

            //determine number to get and number to skip
            if (start != 0)
            {
                query = query.Skip(start);
            }

            //set amount of posts to get back
            if (limit != 0)
            {
                query = query.Take(limit);
            }

            //determine the desired sort method
            if (orderDesc == true)
            {
                query = query.OrderByDescending(p => p.CreateDate);
            } else
            {
                query = query.OrderBy(p => p.CreateDate);
            }

            //ship it!
            return query.ToList();
        }

    }
}
