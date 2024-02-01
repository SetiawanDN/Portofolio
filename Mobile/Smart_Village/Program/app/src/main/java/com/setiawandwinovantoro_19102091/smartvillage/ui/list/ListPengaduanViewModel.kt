package com.setiawandwinovantoro_19102091.smartvillage.ui.list

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.setiawandwinovantoro_19102091.smartvillage.R
import com.setiawandwinovantoro_19102091.smartvillage.data.Pengaduan
import com.setiawandwinovantoro_19102091.smartvillage.data.PengaduanRepository
import com.setiawandwinovantoro_19102091.smartvillage.utils.Event
import kotlinx.coroutines.launch

class ListPengaduanViewModel(private val pengaduanRepository: PengaduanRepository) : ViewModel() {
    private val _snackbarText = MutableLiveData<Event<Int>>()
    val snackbarText: LiveData<Event<Int>> = _snackbarText

    fun deleteTask(pengaduan: Pengaduan) {
        viewModelScope.launch {
            pengaduanRepository.deletePengaduan(pengaduan)
            _snackbarText.value = Event(R.string.delete_pengaduan)
        }
    }
}