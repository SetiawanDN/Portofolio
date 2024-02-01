package com.setiawandwinovantoro_19102091.smartvillage

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class BeritaAdapter(private val listBerita: ArrayList<Berita>
) : RecyclerView.Adapter<BeritaAdapter.ListViewHolder>() {

    private lateinit var mListener: onItemClickListener

    interface onItemClickListener {
        fun onItemClick(position: Int)
    }

    fun setOnItemClickListener(listener: onItemClickListener) {
        mListener = listener
    }

    inner class ListViewHolder(itemView: View, listener: onItemClickListener) :
        RecyclerView.ViewHolder(itemView) {
        var judul: TextView = itemView.findViewById(R.id.tv_item_title)
        var tanggal: TextView = itemView.findViewById(R.id.tv_item_published_date)

        init {
            itemView.setOnClickListener {
                listener.onItemClick(adapterPosition)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ListViewHolder {
        val view: View =
            LayoutInflater.from(parent.context).inflate(R.layout.item_berita, parent, false)
        return ListViewHolder(view, mListener)
    }

    override fun onBindViewHolder(holder: ListViewHolder, position: Int) {
        val(judul, tanggal) = listBerita[position]
        holder.judul.text = judul
        holder.tanggal.text = tanggal
    }

    override fun getItemCount(): Int = listBerita.size

}