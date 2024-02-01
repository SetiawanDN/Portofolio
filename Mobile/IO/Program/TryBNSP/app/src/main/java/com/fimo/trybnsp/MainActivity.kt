package com.fimo.trybnsp

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatButton
import androidx.appcompat.widget.AppCompatImageView
import com.fimo.trybnsp.databinding.ActivityMainBinding
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import java.io.ByteArrayOutputStream

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    private val imgPost: AppCompatImageView by lazy {
        findViewById(R.id.imageDisplay)
    }

    private val btnSubmit: AppCompatButton by lazy {
        findViewById(R.id.btnSubmit)
    }

    var sImage: String? = ""
    private lateinit var db: DatabaseReference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.hide()

        binding.btnSubmit.setOnClickListener {
            insertData()
            val imgURI = btnSubmit.tag as Uri?
            if (imgURI == null) {
                Toast.makeText(this, "Please select image first", Toast.LENGTH_SHORT).show()
            } else {
                FirebaseStorageManager().uploadImage(imgURI)
            }
        }
        binding.btnPilihGambar.setOnClickListener {
            insertImg()
        }
    }

    private fun insertData() {
        val name = binding.editTextNama.text.toString()
        val phone = binding.editTextPhone.text.toString()
        val location = binding.editTextAlamat.text.toString()
        db = FirebaseDatabase.getInstance().getReference("users")
        val user = ItemDs(name, phone, location)
        val databaseReference = FirebaseDatabase.getInstance().reference
        val id = databaseReference.push().key

        db.child(id.toString()).setValue(user).addOnSuccessListener {
            binding.editTextNama.text?.clear()
            binding.editTextPhone.text?.clear()
            binding.editTextAlamat.text?.clear()
            binding.rgOption.clearCheck()
            Toast.makeText(this, "Data berhasil di input", Toast.LENGTH_SHORT).show()
        }.addOnFailureListener {
            Toast.makeText(this, "Data gagal di inputkan", Toast.LENGTH_SHORT).show()
        }
    }

    private fun insertImg() {
        val myFileIntent = Intent(Intent.ACTION_GET_CONTENT)
        myFileIntent.type = "image/*"
        ActivityResultLauncher.launch(myFileIntent)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK) {
            //Image Uri will not be null for RESULT_OK
            val uri: Uri = data?.data!!

            // Use Uri object instead of File to avoid storage permissions
            imgPost.setImageURI(uri)
            btnSubmit.tag = uri
        } else {
            Toast.makeText(this, "Task Cancelled", Toast.LENGTH_SHORT).show()
        }
    }

    private val ActivityResultLauncher = registerForActivityResult<Intent, ActivityResult>(
        ActivityResultContracts.StartActivityForResult()
    ) { result: ActivityResult ->
        if (result.resultCode == RESULT_OK) {
            val uri = result.data!!.data
            btnSubmit.tag = uri
            try {
                val inputStream = contentResolver.openInputStream(uri!!)
                val myBitmap = BitmapFactory.decodeStream(inputStream)
                val stream = ByteArrayOutputStream()
                myBitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
                val bytes = stream.toByteArray()
                sImage = Base64.encodeToString(bytes, Base64.DEFAULT)
                binding.imageDisplay.setImageBitmap(myBitmap)
                inputStream!!.close()
                Toast.makeText(this, "Image Selected", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(this, e.message.toString(), Toast.LENGTH_SHORT).show()
            }
        }

    }
}