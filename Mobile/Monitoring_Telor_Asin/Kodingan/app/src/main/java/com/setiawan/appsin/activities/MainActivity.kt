package com.setiawan.appsin.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import com.setiawan.appsin.R

class MainActivity : AppCompatActivity() {
    private lateinit var btnFetchData: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        supportActionBar?.hide()

        btnFetchData = findViewById(R.id.btnFetchData)

        btnFetchData.setOnClickListener {
            val intent = Intent(this, StateActivity::class.java)
            startActivity(intent)
        }
    }
}