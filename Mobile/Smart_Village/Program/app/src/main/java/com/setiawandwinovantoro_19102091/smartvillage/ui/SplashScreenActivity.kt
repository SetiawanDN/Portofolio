package com.setiawandwinovantoro_19102091.smartvillage

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import com.setiawandwinovantoro_19102091.smartvillage.ui.auth.LoginActivity
import com.setiawandwinovantoro_19102091.smartvillage.ui.auth.SignInActivity

class SplashScreenActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash_screen)

        supportActionBar?.hide()

        Handler().postDelayed({
            val intent = Intent(this@SplashScreenActivity, SignInActivity::class.java)
            startActivity(intent)
            finish()
        }, 3000L)
    }
}