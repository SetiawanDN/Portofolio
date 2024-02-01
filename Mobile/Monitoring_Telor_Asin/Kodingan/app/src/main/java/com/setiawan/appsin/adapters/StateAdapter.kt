package com.setiawan.appsin.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.view.menu.MenuView.ItemView
import androidx.recyclerview.widget.RecyclerView
import com.setiawan.appsin.R
import com.setiawan.appsin.models.StateModel

class StateAdapter(private val stateList: ArrayList<StateModel>) :
    RecyclerView.Adapter<StateAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView =
            LayoutInflater.from(parent.context).inflate(R.layout.state_list_item, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val currentState = stateList[position]
        holder.tvStateValueLight.text = currentState.intensitasCahaya.toString()
        holder.tvStateValueSalt.text = currentState.kadarGaram.toString()
        holder.tvStateValueTemperature.text = currentState.suhu.toString()
        holder.tvStateLightQuality.text = currentState.kualitasIntensitasCahaya.toString()
        holder.tvStateSalinity.text = currentState.kualitasKadarGaram.toString()
        holder.tvStateTemperatureQuality.text = currentState.kualitasSuhu.toString()
    }

    override fun getItemCount(): Int {
        return stateList.size
    }

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvStateValueLight : TextView = itemView.findViewById(R.id.tvIntensitasCahaya)
        val tvStateValueSalt : TextView = itemView.findViewById(R.id.tvKadarGaram)
        val tvStateValueTemperature : TextView = itemView.findViewById(R.id.tvSuhu)
        val tvStateLightQuality : TextView = itemView.findViewById(R.id.tvKualitasIntensitasCahaya)
        val tvStateSalinity : TextView = itemView.findViewById(R.id.tvKualitasKadarGaram)
        val tvStateTemperatureQuality : TextView = itemView.findViewById(R.id.tvKualitasSuhu)
    }

}