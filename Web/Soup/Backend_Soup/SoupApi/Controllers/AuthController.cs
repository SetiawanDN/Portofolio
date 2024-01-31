using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoupApi.Dtos;
using SoupApi.Helpers;
using SoupApi.Models;
using SoupApi.Repositories;

namespace SoupApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public AuthController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("/Login")]
        public ActionResult Login([FromBody] LoginDto data)
        {
            try
            {
                string hashedPassword = PasswordHelper.HashPassword(data.Password);

                User? user = _userRepository.GetByEmailAndPassword(data.Email, hashedPassword);

                if (user == null)
                {
                    return NotFound();
                }

                if (!user.isConfirmed)
                {
                    return StatusCode(500);
                }

                //create token
                string token = JWTHelper.Generate(user.Id, user.Role);

                LoginResDto loginResDto = new LoginResDto();
                loginResDto.Token = token;
                loginResDto.Role = user.Role;

                return Ok(loginResDto);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpPost("/RegisterUser")]
        public async Task<ActionResult> RegisterUser([FromBody] RegisterDto data)
        {
            try
            {
                string hashedPassword = PasswordHelper.HashPassword(data.Password);
                string verificationToken = Guid.NewGuid().ToString();

                string errorMessage = _userRepository.RegisterUser(data.Name, data.Email, hashedPassword, verificationToken);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                //send email
                string htmlEmail = $@"
                                Hello <b>{data.Email}</b>, please click link below to verify<br/>
                                <a href='http://52.237.194.35:2025/success-confirmation/{verificationToken}'>Verify My Account</a>
                                ";
                await MailHelper.Send("Dear User", data.Email, "Email Verification", htmlEmail);

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/RegisterUserAdmin")]
        public ActionResult RegisterUserAdmin([FromBody] RegisterDtoAdmin data)
        {
            try
            {
                string hashedPassword = PasswordHelper.HashPassword(data.Password);

                string errorMessage = _userRepository.RegisterUserAdmin(data.Name, data.Email, hashedPassword, data.Role);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("UpdateUserAdmin/{id}")]
        public ActionResult UpdateUserAdmin(int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            try
            {
                string errorMessage = _userRepository.UpdateUserAdmin(id, userUpdateDto.Name, userUpdateDto.Email, userUpdateDto.Role);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("UpdateUserIsActivated/{id}")]
        public IActionResult UpdateUserIsActivated(int id, [FromBody] UpdateIsActivatedDto updateIsActivatedDto)
        {
            try
            {
                string errorMessage = _userRepository.UpdateIsActivated(id, updateIsActivatedDto.IsActivated);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetAllUsersAdmin")]
        public IActionResult GetAllUserAdmin()
        {
            try
            {
                var users = _userRepository.GetAllUsersAdmin();
                return Ok(users);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpPost("/Verify")]
        public ActionResult Verify([FromBody] VerifyDto data)
        {
            try
            {
                User? user = _userRepository.GetByToken(data.Token);
                if (user == null)
                {
                    return NotFound();
                }

                // activate user
                string errorMessage = _userRepository.Activate(user.Id);
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpPatch("/RequestResetPassword")]
        public async Task<ActionResult> RequestResetPassword([FromBody] ResetPasswordDto data)
        {
            try
            {
                string verificationToken = Guid.NewGuid().ToString();

                string errorMessage = _userRepository.RequestResetPassword(data.Email, verificationToken);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                //send email
                string htmlEmail = $@"
                                Hello <b>{data.Email}</b>, please click link below to change your password<br/>
                                <a href='http://52.237.194.35:2025/new-password/{verificationToken}'>Change My Password</a>
                                ";
                await MailHelper.Send("Dear User", data.Email, "Change Password", htmlEmail);

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpPatch("/ChangePassword")]
        public IActionResult ChangePassword([FromBody] ChangePasswordDto data)
        {
            try
            {
                string hashedPassword = PasswordHelper.HashPassword(data.Password);
                string errorMessage = _userRepository.ChangePassword(data.Token, hashedPassword);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

    }
}
