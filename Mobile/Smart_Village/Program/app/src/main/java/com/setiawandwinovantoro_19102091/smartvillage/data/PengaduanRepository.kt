package com.setiawandwinovantoro_19102091.smartvillage.data

import android.content.Context
import androidx.lifecycle.LiveData

class PengaduanRepository(private val pengaduanDao: PengaduanDao) {
    companion object {
        const val PAGE_SIZE = 30
        const val PLACEHOLDERS = true

        @Volatile
        private var instance: PengaduanRepository? = null

        fun getInstance(context: Context): PengaduanRepository {
            return instance ?: synchronized(this) {
                if (instance == null) {
                    val database = PengaduanDatabase.getInstance(context)
                    instance = PengaduanRepository(database.pengaduanDao())
                }
                return instance as PengaduanRepository
            }
        }
    }

    fun getPengaduanById(pengaduanId: Int): LiveData<Pengaduan> {
        return pengaduanDao.getPengaduanId(pengaduanId)
    }

    suspend fun insertPengaduan(newPengaduan: Pengaduan): Long {
        return pengaduanDao.insertPengaduan(newPengaduan)
    }

    suspend fun deletePengaduan(pengaduan: Pengaduan) {
        pengaduanDao.deleteTask(pengaduan)
    }
}