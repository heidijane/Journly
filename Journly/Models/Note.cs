using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class Note
    {
        public int Id { get; set; }

        public int TherapistId { get; set; }

        public User Therapist { get; set; }

        [Required]
        public int ClientId { get; set; }

        public User Client { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }

        [Required]
        public string Content { get; set; }

        public bool Deleted { get; set; }
    }
}
