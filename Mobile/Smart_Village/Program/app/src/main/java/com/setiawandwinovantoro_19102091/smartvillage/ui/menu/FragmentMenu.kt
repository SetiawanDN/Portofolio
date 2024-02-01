package com.setiawandwinovantoro_19102091.smartvillage.ui.menu

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.setiawandwinovantoro_19102091.smartvillage.databinding.FragmentMenuBinding
import com.setiawandwinovantoro_19102091.smartvillage.ui.add.AddPengaduanActivity
import com.setiawandwinovantoro_19102091.smartvillage.ui.berita.BeritaActivity
import com.setiawandwinovantoro_19102091.smartvillage.ui.list.ListPengaduanActivity
import com.setiawandwinovantoro_19102091.smartvillage.ui.statistika.StatistikActivity

class FragmentMenu : Fragment() {
    private var _binding: FragmentMenuBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        // return inflater.inflate(R.layout.fragment_menu, container, false)
        _binding = FragmentMenuBinding.inflate(inflater, container, false)
        val view = binding.root
        return view

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.tombol1.setOnClickListener {
            activity?.let {
                val intent = Intent(it, BeritaActivity::class.java)
                it.startActivity(intent)
            }
        }
        binding.tombol2.setOnClickListener {
            activity?.let {
                val intent = Intent(it, AddPengaduanActivity::class.java)
                it.startActivity(intent)
            }
        }
        binding.tombol3.setOnClickListener {
            activity?.let {
                val intent = Intent(it, StatistikActivity::class.java)
                it.startActivity(intent)
            }
        }
        binding.tombol4.setOnClickListener {
            activity?.let {
                val intent = Intent(it, ListPengaduanActivity::class.java)
                it.startActivity(intent)
            }
        }
    }
}