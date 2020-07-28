using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Models
{
    public class UserWithTherapistId
    {
        public User User { get; set; }

        public int TherapistId { get; set; }
    }
}
