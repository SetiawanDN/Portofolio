package com.setiawandwinovantoro_19102091.smartvillage.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.setiawandwinovantoro_19102091.smartvillage.R
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.util.concurrent.Executors

@Database(entities = [Pengaduan::class], version = 1, exportSchema = false)
abstract class PengaduanDatabase : RoomDatabase() {
    abstract fun pengaduanDao(): PengaduanDao

    companion object {
        @Volatile
        private var INSTANCE: PengaduanDatabase? = null

        fun getInstance(context: Context): PengaduanDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    PengaduanDatabase::class.java,
                    "pengaduan.db"
                )
                    .fallbackToDestructiveMigration()
                    .allowMainThreadQueries()
                    .addCallback(object : Callback() {
                        override fun onCreate(db: SupportSQLiteDatabase) {
                            Executors.newSingleThreadScheduledExecutor().execute {
                                fillWithStartingData(context, getInstance(context).pengaduanDao())
                            }
                        }
                    })
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private fun fillWithStartingData(context: Context, dao: PengaduanDao) {
            val task = loadJsonArray(context)
            try {
                if (task != null) {
                    for (i in 0 until task.length()) {
                        val item = task.getJSONObject(i)
                        dao.insertAll(
                            Pengaduan(
                                item.getInt("id"),
                                item.getString("name"),
                                item.getString("phone"),
                                item.getLong("date"),
                                item.getString("location"),
                                item.getString("description")
                            )
                        )
                    }
                }
            } catch (exception: JSONException) {
                exception.printStackTrace()
            }
        }

        private fun loadJsonArray(context: Context): JSONArray? {
            val builder = StringBuilder()
            val `in` = context.resources.openRawResource(R.raw.pengaduan)
            val reader = BufferedReader(InputStreamReader(`in`))
            var line: String?
            try {
                while (reader.readLine().also { line = it } != null) {
                    builder.append(line)
                }
                val json = JSONObject(builder.toString())
                return json.getJSONArray("pengaduan")
            } catch (exception: IOException) {
                exception.printStackTrace()
            } catch (exception: JSONException) {
                exception.printStackTrace()
            }
            return null
        }
    }
}