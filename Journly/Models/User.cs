using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string FirebaseUserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Required]
        [MaxLength(50)]
        public string NickName { get; set; }

        [Required]
        public DateTime Birthday { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Avatar { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }

        [Required]
        public int UserTypeId { get; set; }

        public UserType UserType { get; set; }
    }
}
