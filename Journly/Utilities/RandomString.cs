using System;
using System.Text;

namespace Journly
{
    public static class RandomString
    {
        //returns a GUID with any special characters removed
        //used in the generation of counselor codes
		public static string Generate()
        {
            Guid g = Guid.NewGuid();
            string GuidString = Convert.ToBase64String(g.ToByteArray());
            GuidString = GuidString.Replace("=", "");
            GuidString = GuidString.Replace("+", "");
            GuidString = GuidString.Replace("/", "");

            return GuidString;
        }
    }
}
