using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DogGo.Models
{
    public class Dog
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Your dog needs a name!")]
        [MaxLength(35)]
        public string Name { get; set; }
        public int OwnerId { get; set; }
        [Required]
        [MaxLength(35)]
        public string Breed { get; set; }
        public string Notes { get; set; }
        public string ImageUrl { get; set; }

        public Owner Owner { get; set; }
    }
}
