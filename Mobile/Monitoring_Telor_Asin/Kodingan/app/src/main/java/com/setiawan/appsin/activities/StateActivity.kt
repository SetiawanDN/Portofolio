package com.setiawan.appsin.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.database.*
import com.setiawan.appsin.R
import com.setiawan.appsin.adapters.StateAdapter
import com.setiawan.appsin.models.StateModel

class StateActivity : AppCompatActivity() {
    private lateinit var stateRecyclerView: RecyclerView
    private lateinit var tvLoadingData : TextView
    private lateinit var stateList : ArrayList<StateModel>
    private lateinit var dbRef : DatabaseReference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_state)

        supportActionBar?.hide()

        stateRecyclerView = findViewById(R.id.rvState)
        stateRecyclerView.layoutManager = LinearLayoutManager(this)
        stateRecyclerView.setHasFixedSize(true)
        tvLoadingData = findViewById(R.id.tvLoadingData)

        stateList = arrayListOf<StateModel>()
        getStateData()
    }

    private fun getStateData() {
        stateRecyclerView.visibility = View.GONE
        tvLoadingData.visibility = View.VISIBLE

        dbRef = FirebaseDatabase.getInstance().getReference("state")

        dbRef.addValueEventListener(object : ValueEventListener{
            override fun onDataChange(snapshot: DataSnapshot) {
                stateList.clear()
                if (snapshot.exists()){
                    for (stateSnap in snapshot.children) {
                        val stateData = stateSnap.getValue(StateModel::class.java)
                        stateList.add(stateData!!)
                    }
                    val mAdapter = StateAdapter(stateList)
                    stateRecyclerView.adapter = mAdapter
                    stateRecyclerView.visibility = View.VISIBLE
                    tvLoadingData.visibility = View.GONE
                }
            }

            override fun onCancelled(error: DatabaseError) {
                TODO("Not yet implemented")
            }

        })
    }
}