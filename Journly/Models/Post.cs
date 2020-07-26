using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class Post
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }

        [Required]
        public int MoodId { get; set; }

        public MoodType Mood { get; set; }

        public string Content { get; set; }

        public DateTime EditTime { get; set; }

        public bool Flagged { get; set; }

        public int TherapistId { get; set; }

        public DateTime ViewTime { get; set; }

        public string Comment { get; set; }

        public bool Deleted { get; set; }
    }
}
