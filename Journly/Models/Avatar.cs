using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class Avatar
    {
        public int Id { get; set; }
        [ForeignKey("AvatarId")]

        public string Image { get; set; }

        public string Name { get; set; }

        public User User { get; set; }
    }
}
