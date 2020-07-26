using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class FlaggedWord
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Word { get; set; }
    }
}
