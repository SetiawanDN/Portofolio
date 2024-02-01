package com.setiawandwinovantoro_19102091.smartvillage.ui.berita

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.setiawandwinovantoro_19102091.smartvillage.Berita
import com.setiawandwinovantoro_19102091.smartvillage.BeritaAdapter
import com.setiawandwinovantoro_19102091.smartvillage.R

class BeritaActivity : AppCompatActivity() {
    private lateinit var rvBerita: RecyclerView
    private val list = ArrayList<Berita>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_berita)

        rvBerita = findViewById(R.id.rv_berita)
        rvBerita.setHasFixedSize(true)

        list.addAll(listBerita)
        showRecyclerList()
    }

    private val listBerita: ArrayList<Berita>
        get() {
            val judul = resources.getStringArray(R.array.judul)
            val tanggal = resources.getStringArray(R.array.tanggal_upload)
            val listUser = ArrayList<Berita>()
            for (i in judul.indices) {
                val user = Berita(
                    judul[i],
                    tanggal[i],
                )
                listUser.add(user)
            }
            return listUser
        }

    private fun showRecyclerList() {
        rvBerita.layoutManager = LinearLayoutManager(this)
        val listUserAdapter = BeritaAdapter(list)
        rvBerita.adapter = listUserAdapter
        listUserAdapter.setOnItemClickListener(object : BeritaAdapter.onItemClickListener {
            override fun onItemClick(position: Int) {
                val intent = Intent(this@BeritaActivity, DetailBeritaActivity::class.java)
                intent.putExtra(
                    "userdata",
                    listBerita[position].judul + "\n"
                            + listBerita[position].tanggal + "\n"
                )
                intent.putExtra("name", listBerita[position].tanggal)
                startActivity(intent)
            }
        })
    }
}