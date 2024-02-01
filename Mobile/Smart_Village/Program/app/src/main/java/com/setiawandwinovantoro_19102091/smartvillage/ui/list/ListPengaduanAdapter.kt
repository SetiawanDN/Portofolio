package com.setiawandwinovantoro_19102091.smartvillage.ui.list

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.paging.PagedListAdapter
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.setiawandwinovantoro_19102091.smartvillage.R
import com.setiawandwinovantoro_19102091.smartvillage.data.Pengaduan
import com.setiawandwinovantoro_19102091.smartvillage.ui.detail.DetailPengaduanActivity
import com.setiawandwinovantoro_19102091.smartvillage.utils.DateConverter
import com.setiawandwinovantoro_19102091.smartvillage.utils.PENGADUAN_ID

class ListPengaduanAdapter :
    PagedListAdapter<Pengaduan, ListPengaduanAdapter.ListPengaduanViewHolder>(DIFF_CALLBACK) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ListPengaduanViewHolder {
        return ListPengaduanViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.pengaduan_item, parent, false)
        )
    }

    override fun onBindViewHolder(holder: ListPengaduanViewHolder, position: Int) {
        getItem(position)?.let {
            holder.bind(it)
        }
    }

    inner class ListPengaduanViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val tvName: TextView = itemView.findViewById(R.id.item_tv_title)
        private val tvDate: TextView = itemView.findViewById(R.id.item_tv_date)

        lateinit var getPengaduan: Pengaduan

        fun bind(pengaduan: Pengaduan) {
            getPengaduan = pengaduan
            tvName.text = pengaduan.name
            tvDate.text = DateConverter.convertMillisToString(pengaduan.date)
            val (id, name, phone, date, location, description) = pengaduan
            itemView.apply {
                tvName.text = name
                tvDate.text = date.toString()
            }

            itemView.setOnClickListener{
                val detailIntent = Intent(itemView.context, DetailPengaduanActivity::class.java)
                detailIntent.putExtra(PENGADUAN_ID, pengaduan.id)
                itemView.context.startActivity(detailIntent)
            }
        }
    }

    companion object {

        private val DIFF_CALLBACK = object : DiffUtil.ItemCallback<Pengaduan>() {
            override fun areItemsTheSame(oldItem: Pengaduan, newItem: Pengaduan): Boolean {
                return oldItem.id == newItem.id
            }

            override fun areContentsTheSame(oldItem: Pengaduan, newItem: Pengaduan): Boolean {
                return oldItem == newItem
            }
        }

    }
}