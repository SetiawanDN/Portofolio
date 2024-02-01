package com.setiawandwinovantoro_19102091.smartvillage.ui.list

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.setiawandwinovantoro_19102091.smartvillage.R
import com.setiawandwinovantoro_19102091.smartvillage.ui.ViewModelFactory
import com.setiawandwinovantoro_19102091.smartvillage.ui.add.AddPengaduanActivity

class ListPengaduanActivity : AppCompatActivity() {
    private lateinit var recycler: RecyclerView
    private lateinit var pengaduanViewModel: ListPengaduanViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_list_pengaduan)

        findViewById<FloatingActionButton>(R.id.fab).setOnClickListener { view ->
            val addIntent = Intent(this, AddPengaduanActivity::class.java)
            startActivity(addIntent)
        }

        recycler = findViewById(R.id.rvPengaduan)
        recycler.layoutManager = LinearLayoutManager(this)

        initAction()

        val factory = ViewModelFactory.getInstance(this)
        pengaduanViewModel =
            ViewModelProvider(this, factory).get(ListPengaduanViewModel::class.java)
    }

    private fun initAction() {
        val itemTouchHelper = ItemTouchHelper(object : ItemTouchHelper.Callback() {
            override fun getMovementFlags(
                recyclerView: RecyclerView,
                viewHolder: RecyclerView.ViewHolder
            ): Int {
                return makeMovementFlags(0, ItemTouchHelper.RIGHT)
            }

            override fun onMove(
                recyclerView: RecyclerView,
                viewHolder: RecyclerView.ViewHolder,
                target: RecyclerView.ViewHolder
            ): Boolean {
                return false
            }

            override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
                val task = (viewHolder as ListPengaduanAdapter.ListPengaduanViewHolder).getPengaduan
                pengaduanViewModel.deleteTask(task)
            }

        })
        itemTouchHelper.attachToRecyclerView(recycler)
    }
}