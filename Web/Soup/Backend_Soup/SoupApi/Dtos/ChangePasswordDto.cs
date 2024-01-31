namespace SoupApi.Dtos
{
    public class ChangePasswordDto
    {
        public string Token { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
