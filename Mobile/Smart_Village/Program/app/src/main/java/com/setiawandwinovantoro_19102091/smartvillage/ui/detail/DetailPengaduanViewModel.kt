package com.setiawandwinovantoro_19102091.smartvillage.ui.detail

import androidx.lifecycle.*
import com.setiawandwinovantoro_19102091.smartvillage.data.Pengaduan
import com.setiawandwinovantoro_19102091.smartvillage.data.PengaduanRepository
import kotlinx.coroutines.launch

class DetailPengaduanViewModel(private val pengaduanRepository: PengaduanRepository) : ViewModel() {
    private val _pengaduanId = MutableLiveData<Int>()

    private val _task = _pengaduanId.switchMap { id ->
        pengaduanRepository.getPengaduanById(id)
    }
    val pengaduan: LiveData<Pengaduan> = _task

    fun setTaskId(pengaduanId: Int?) {
        if (pengaduanId == _pengaduanId.value) {
            return
        }
        _pengaduanId.value = pengaduanId!!
    }

    fun deletePengaduan() {
        viewModelScope.launch {
            _task.value?.let { pengaduanRepository.deletePengaduan(it) }
        }
    }
}