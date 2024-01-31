using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoupApi.Dtos;
using SoupApi.Models;
using SoupApi.Repositories;
using System.Security.Claims;

namespace SoupApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartRepository _cartRepository;
        public CartController(CartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        [Authorize]
        [HttpPost("Create")]
        public IActionResult CreateCart([FromBody] CartDto cartDto)
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.Sid));
                string errorMessage = _cartRepository.Create(userId, cartDto.Fk_id_product, cartDto.Schedule);

                // kalau ada isi nya
                if (!string.IsNullOrEmpty(errorMessage))
                {
                    // berarti ada error
                    return Problem(errorMessage);
                }

                //kalau tidak maka oke
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem("User menambahkan kelas yang sama pada jadwal yang sama");
            }

        }

        [Authorize]
        [HttpGet("GetCartsByUserId")]
        public IActionResult GetById()
        {
            try
            {
                int userId = int.Parse(User.FindFirstValue(ClaimTypes.Sid));
                var carts = _cartRepository.GetCartsByUserId(userId);
                return Ok(carts);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize]
        [HttpPatch("UpdateCartIsActivated/{id}")]
        public IActionResult UpdateCartIsActivated(int id)
        {
            try
            {
                string errorMessage = _cartRepository.UpdateIsActivatedFalse(id);

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
