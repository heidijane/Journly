using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class UserRelationship
    {
        public int Id { get; set; }

        [Required]
        public int TherapistId { get; set; }

        public User Therapist { get; set; }

        [Required]
        public int ClientId { get; set; }

        public User Client { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
