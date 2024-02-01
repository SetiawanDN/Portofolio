package com.setiawandwinovantoro_19102091.smartvillage.ui.detail

import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.textfield.TextInputEditText
import com.setiawandwinovantoro_19102091.smartvillage.R
import com.setiawandwinovantoro_19102091.smartvillage.data.Pengaduan
import com.setiawandwinovantoro_19102091.smartvillage.ui.ViewModelFactory
import com.setiawandwinovantoro_19102091.smartvillage.utils.DateConverter
import com.setiawandwinovantoro_19102091.smartvillage.utils.PENGADUAN_ID

class DetailPengaduanActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_pengaduan)

        val factory = ViewModelFactory.getInstance(this)
        val detailPengaduanViewModel =
            ViewModelProvider(this, factory).get(DetailPengaduanViewModel::class.java)

        val extras = intent.extras
        if (extras != null) {
            val pengaduanId = extras.getInt(PENGADUAN_ID)

            detailPengaduanViewModel.setTaskId(pengaduanId)
            detailPengaduanViewModel.pengaduan.observe(this) { pengaduan ->
                populateTasks(pengaduan)
                findViewById<Button>(R.id.deleteButton).setOnClickListener {
                    detailPengaduanViewModel.deletePengaduan()
                    finish()
                }
            }
        }
    }

    private fun populateTasks(pengaduan: Pengaduan?) {
        val edtName = findViewById<TextInputEditText>(R.id.addName)
        val edtPhone = findViewById<TextInputEditText>(R.id.addPhone)
        val edtLocation = findViewById<TextInputEditText>(R.id.addLocation)
        val edtDescription = findViewById<TextInputEditText>(R.id.addDescription)
        val date = findViewById<TextInputEditText>(R.id.addDate)
        if (pengaduan != null) {
            edtName.setText(pengaduan.name)
            edtPhone.setText(pengaduan.phone)
            edtLocation.setText(pengaduan.location)
            edtDescription.setText(pengaduan.description)
            date.setText(DateConverter.convertMillisToString(pengaduan.date))
        }
    }
}