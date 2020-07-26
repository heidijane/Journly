using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class Therapist
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public User User { get; set; }

        [Required]
        public bool Verified { get; set; }

        [Required]
        [MaxLength(255)]
        public string Company { get; set; }

        [Required]
        [MaxLength(50)]
        public string Code { get; set; }
    }
}
