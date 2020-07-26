using Microsoft.EntityFrameworkCore;
using Journly.Models;

namespace Journly.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<FlaggedWord> FlaggedWord { get; set; }
        public DbSet<MoodType> MoodType { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Therapist> Therapist { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserRelationship> UserRelationship { get; set; }
        public DbSet<UserType> UserType { get; set; }

    }
}

