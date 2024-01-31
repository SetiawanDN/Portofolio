using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SoupApi.Dtos;
using SoupApi.Models;
using SoupApi.Repositories;

namespace SoupApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryRepository _categoryRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CategoryController(CategoryRepository categoryRepository, IWebHostEnvironment webHostEnvironment)
        {
            _categoryRepository = categoryRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            try
            {
                var categories = _categoryRepository.GetAll();
                return Ok(categories);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetAllAdmin")]
        public IActionResult GetAllAdmin()
        {
            try
            {
                var categories = _categoryRepository.GetAllAdmin();
                return Ok(categories);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var categories = _categoryRepository.GetById(id);
                return Ok(categories);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return Problem(e.ToString());
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost("Create")]
        public async Task<ActionResult> CreateCategory([FromForm] CategoryDto categoryDto)
        {
            try
            {
                IFormFile image = categoryDto.Image!;

                // TODO: save image to server
                var ext = Path.GetExtension(image.FileName).ToLowerInvariant(); //.jpg

                //get filename
                string fileName = Guid.NewGuid().ToString() + ext; //pasti unik
                string uploadDir = "uploads"; //foldering biar rapih
                string physicalPath = $"wwwroot/{uploadDir}";
                //saving image
                var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, physicalPath, fileName); // /wwwroot/uploads/asdasd.png
                using var stream = System.IO.File.Create(filePath);
                await image.CopyToAsync(stream);

                //create url path
                string fileUrlPath = $"{uploadDir}/{fileName}";

                string errorMessage = _categoryRepository.Create(new Category
                {
                    Name = categoryDto.Name,
                    Description = categoryDto.Description,
                    Image = fileUrlPath
                });

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
        [HttpPatch("Update/{id}")]
        public async Task<ActionResult> UpdateCategory(int id, [FromForm] CategoryDto categoryDto)
        {
            try
            {
                string img = string.Empty;
                if (categoryDto.Image != null)
                {
                    IFormFile image = categoryDto.Image!;

                    // TODO: save image to server
                    var ext = Path.GetExtension(image.FileName).ToLowerInvariant(); //.jpg

                    //get filename
                    string fileName = Guid.NewGuid().ToString() + ext; //pasti unik
                    string uploadDir = "uploads"; //foldering biar rapih
                    string physicalPath = $"wwwroot/{uploadDir}";
                    //saving image
                    var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, physicalPath, fileName); // /wwwroot/uploads/asdasd.png
                    using var stream = System.IO.File.Create(filePath);
                    await image.CopyToAsync(stream);

                    //create url path
                    string fileUrlPath = $"{uploadDir}/{fileName}";
                    img = fileUrlPath;
                }
                else
                {
                    img = _categoryRepository.GetImage(id);
                }

                string errorMessage = _categoryRepository.Update(new Category
                {
                    Id = id,
                    Name = categoryDto.Name,
                    Description = categoryDto.Description,
                    Image = img,
                });

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
        [HttpPatch("UpdateIsActivated/{id}")]
        public IActionResult UpdateCategoryIsActivated(int id, [FromBody] UpdateIsActivatedDto updateIsActivatedDto)
        {
            try
            {
                string errorMessage = _categoryRepository.UpdateIsActivated(new Category
                {
                    Id = id,
                    IsActivated = updateIsActivatedDto.IsActivated,
                });

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
