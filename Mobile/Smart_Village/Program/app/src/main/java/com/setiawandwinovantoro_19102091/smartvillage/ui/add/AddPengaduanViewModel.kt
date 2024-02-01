package com.setiawandwinovantoro_19102091.smartvillage.ui.add

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.setiawandwinovantoro_19102091.smartvillage.data.Pengaduan
import com.setiawandwinovantoro_19102091.smartvillage.data.PengaduanRepository
import kotlinx.coroutines.launch

class AddPengaduanViewModel(private val pengaduanRepository: PengaduanRepository): ViewModel() {
    fun addPengaduan(pengaduan: Pengaduan) {
        viewModelScope.launch {
            pengaduanRepository.insertPengaduan(pengaduan)
        }
    }
}