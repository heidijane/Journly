using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class TherapistConfirmationInfo
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string NickName { get; set; }

        public int AvatarId { get; set; }

        public Avatar Avatar { get; set; }

        public string FavColor { get; set; }

        [Required]
        public bool Verified { get; set; }

        [Required]
        public string Company { get; set; }

        [Required]
        public string Code { get; set; }
    }
}
