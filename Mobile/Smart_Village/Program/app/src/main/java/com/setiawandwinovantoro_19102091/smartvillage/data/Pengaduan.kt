package com.setiawandwinovantoro_19102091.smartvillage.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "pengaduan")
data class Pengaduan(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val name: String,
    val phone: String,
    val date: Long,
    val location: String,
    val description: String
)
