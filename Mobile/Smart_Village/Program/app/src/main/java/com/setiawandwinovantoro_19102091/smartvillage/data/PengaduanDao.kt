package com.setiawandwinovantoro_19102091.smartvillage.data

import androidx.lifecycle.LiveData
import androidx.paging.DataSource
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteQuery

@Dao
interface PengaduanDao {

    @RawQuery(observedEntities = [Pengaduan::class])
    fun getPengaduan(query: SupportSQLiteQuery): DataSource.Factory<Int, Pengaduan>

    @Query("SELECT * FROM pengaduan WHERE id = :pengaduanId")
    fun getPengaduanId(pengaduanId: Int): LiveData<Pengaduan>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    fun insertPengaduan(pengaduan: Pengaduan): Long

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    fun insertAll(vararg pengaduan: Pengaduan)

    @Delete
    fun deleteTask(pengaduan: Pengaduan)
}