using Microsoft.EntityFrameworkCore;
using Journly.Models;

namespace Journly.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<FlaggedWord> FlaggedWord { get; set; }
        public DbSet<MoodType> MoodType { get; set; }
        public DbSet<Avatar> Avatar { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Therapist> Therapist { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserRelationship> UserRelationship { get; set; }
        public DbSet<UserType> UserType { get; set; }

        //manually establishes the foreign key between User and UserRelationship
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(a => a.UserRelationship)
                .WithOne(b => b.User)
                .HasForeignKey<UserRelationship>(b => b.UserId);
        }

    }
}

