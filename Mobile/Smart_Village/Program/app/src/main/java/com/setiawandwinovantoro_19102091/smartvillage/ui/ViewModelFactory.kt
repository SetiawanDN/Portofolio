package com.setiawandwinovantoro_19102091.smartvillage.ui

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.setiawandwinovantoro_19102091.smartvillage.data.PengaduanRepository
import com.setiawandwinovantoro_19102091.smartvillage.ui.add.AddPengaduanViewModel
import com.setiawandwinovantoro_19102091.smartvillage.ui.detail.DetailPengaduanViewModel
import com.setiawandwinovantoro_19102091.smartvillage.ui.list.ListPengaduanViewModel

class ViewModelFactory private constructor(private val pengaduanRepository: PengaduanRepository) :
    ViewModelProvider.Factory {

    companion object {
        @Volatile
        private var instance: ViewModelFactory? = null

        fun getInstance(context: Context): ViewModelFactory =
            instance ?: synchronized(this) {
                instance ?: ViewModelFactory(
                    PengaduanRepository.getInstance(context)
                )
            }
    }

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T =
        when {
            modelClass.isAssignableFrom(AddPengaduanViewModel::class.java) -> {
                AddPengaduanViewModel(pengaduanRepository) as T
            }
            modelClass.isAssignableFrom(ListPengaduanViewModel::class.java) -> {
                ListPengaduanViewModel(pengaduanRepository) as T
            }
            modelClass.isAssignableFrom(DetailPengaduanViewModel::class.java) -> {
                DetailPengaduanViewModel(pengaduanRepository) as T
            }
            else -> throw Throwable("Unknown ViewModel class: " + modelClass.name)
        }
}