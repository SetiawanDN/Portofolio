package com.setiawandwinovantoro_19102091.smartvillage

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Berita(
        var judul: String,
        var tanggal: String,
) : Parcelable