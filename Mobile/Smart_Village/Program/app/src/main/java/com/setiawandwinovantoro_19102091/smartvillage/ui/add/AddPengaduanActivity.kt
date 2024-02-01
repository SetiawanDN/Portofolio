package com.setiawandwinovantoro_19102091.smartvillage.ui.add

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import com.setiawandwinovantoro_19102091.smartvillage.R
import com.setiawandwinovantoro_19102091.smartvillage.data.Pengaduan
import com.setiawandwinovantoro_19102091.smartvillage.databinding.ActivityAddPengaduanBinding
import com.setiawandwinovantoro_19102091.smartvillage.ui.ViewModelFactory
import com.setiawandwinovantoro_19102091.smartvillage.ui.camera.CameraActivity
import com.setiawandwinovantoro_19102091.smartvillage.utils.DatePickerFragment
import com.setiawandwinovantoro_19102091.smartvillage.utils.rotateBitmap
import com.setiawandwinovantoro_19102091.smartvillage.utils.uriToFile
import java.io.File
import java.text.SimpleDateFormat
import java.util.*


class AddPengaduanActivity : AppCompatActivity(), DatePickerFragment.DialogDateListener {
    private var date: Long = System.currentTimeMillis()
    private lateinit var binding: ActivityAddPengaduanBinding

    private var getFile: File? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddPengaduanBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.title = getString(R.string.add_pengaduan)

        binding.openCamera.setOnClickListener {
            if (!allPermissionGrandted()) {
                ActivityCompat.requestPermissions(
                    this,
                    REQUIRED_PERMISSIONS,
                    REQUEST_CODE_PERMISSIONS
                )
                return@setOnClickListener
            }
            startCamerax()
        }

        binding.openFolder.setOnClickListener { startGallery() }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_add, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_save -> {
                //TODO 12 : Create AddTaskViewModel and insert new task to database
                val factory = ViewModelFactory.getInstance(this)
                val addTaskViewModel =
                    ViewModelProvider(this, factory).get(AddPengaduanViewModel::class.java)

                val edtName = findViewById<TextView>(R.id.addName)
                val name = edtName.text.toString().trim()

                val edtPhone = findViewById<TextView>(R.id.addPhone)
                val phone = edtPhone.text.toString().trim()

                val edtLocation = findViewById<TextView>(R.id.addLocation)
                val location = edtLocation.text.toString().trim()

                val edtDescription = findViewById<TextView>(R.id.addDescription)
                val description = edtDescription.text.toString().trim()

                if (name.isNotEmpty() && phone.isNotEmpty() && location.isNotEmpty() && description.isNotEmpty()) {
                    val task = Pengaduan(
                        name = name,
                        phone = phone,
                        date = date,
                        location = location,
                        description = description
                    )
                    addTaskViewModel.addPengaduan(task)
                    finish()

                } else {
                    Toast.makeText(this, getString(R.string.empty_task_message), Toast.LENGTH_SHORT)
                        .show()
                }
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    fun showDatePicker(view: View) {
        val dialogFragment = DatePickerFragment()
        dialogFragment.show(supportFragmentManager, "datePicker")
    }

    override fun onDialogDateSet(tag: String?, year: Int, month: Int, dayOfMonth: Int) {
        val calendar = Calendar.getInstance()
        calendar.set(year, month, dayOfMonth)
        val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
        findViewById<TextView>(R.id.addDate).text = dateFormat.format(calendar.time)

        date = calendar.timeInMillis
    }

    //Check Permission
    private fun checkPermission(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(
            this, permission
        ) == PackageManager.PERMISSION_GRANTED
    }

    //User give permission
    private fun allPermissionGrandted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(baseContext, it) == PackageManager.PERMISSION_GRANTED
    }

    //Open Folder
    private fun startGallery() {
        val intent = Intent()
        intent.action = Intent.ACTION_GET_CONTENT
        intent.type = "image/*"
        val chooser = Intent.createChooser(intent, getString(R.string.choose_item))
        launcherIntentGallery.launch(chooser)
    }

    //Launcher for gallery
    private val launcherIntentGallery = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val selectedItem: Uri = result.data?.data as Uri
            val myFile = uriToFile(selectedItem, this@AddPengaduanActivity)

            getFile = myFile
            binding.reportImage.setImageURI(selectedItem)
        }
    }

    //Start CameraX
    private fun startCamerax() {
        val intent = Intent(this, CameraActivity::class.java)
        launcherIntentCameraX.launch(intent)
    }

    //Launcher for CameraX
    private val launcherIntentCameraX =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
            if (it.resultCode == CAMERA_X_RESULT) {
                val myFile: File = it.data?.getSerializableExtra(EXTRA_PHOTO) as File
                val backCamera = it.data?.getBooleanExtra(BACK_CAMERA, true) as Boolean
                getFile = myFile

                val result = if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.O) {
                    BitmapFactory.decodeFile(myFile.path)
                } else {
                    rotateBitmap(BitmapFactory.decodeFile(myFile.path), backCamera)
                }

                binding.reportImage.setImageBitmap(result)
            }
        }

    companion object {
        const val CAMERA_X_RESULT = 200
        const val EXTRA_PHOTO = "extra_photo"
        const val BACK_CAMERA = "extra_BackCamera"

        private val REQUIRED_PERMISSIONS = arrayOf(Manifest.permission.CAMERA)
        private const val REQUEST_CODE_PERMISSIONS = 10
    }
}