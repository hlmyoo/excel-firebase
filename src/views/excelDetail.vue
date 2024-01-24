<template>
    <button class="sidebar" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"><i class="fa-solid fa-bars"></i></button>

    <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1"
        id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasScrollingLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <p><router-link to="/">Home</router-link></p>
            <p><router-link to="/excel">Excel Data</router-link></p>
        </div>
    </div>
    <h1 align="center">{{ fileName }}</h1>
    <div class="container">
        <button class="btn btn-info mt-3 mb-3" @click="exportData">Export Excel</button>
        <!-- <table class="table table-hover table-stripped">
            <thead>
                <tr v-for="i in data" :key="i.id">
                    <td>{{ i }}</td>
                </tr>
            </thead>
        </table> -->
        <div class="table-container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <!-- Menampilkan header sesuai dengan data yang didapat dari Firebase -->
                        <th v-for="header in headers" :key="header">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Menampilkan rows sesuai dengan data yang didapat dari Firebase -->
                    <tr v-for="row in data" :key="row.id">
                        <td v-for="(value, index) in row" :key="index">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { db } from '../firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import * as XLSX from "xlsx";


export default {
    name: 'app',
    data() {
        return {
            headers: [],
            data: [],
            fileName: ''
        }
    },
    mounted() {
        this.getExcel()
        // console.log(this.$router.params
    },
    methods: {
        async getExcel() {
            try {
                const get = doc(db, 'excel', this.$route.params.id)
                const getSnap = await getDoc(get)
                console.log(getSnap.data())
                this.headers = getSnap.data().header
                this.fileName = getSnap.data().fileName
                this.data = getSnap.data().rows
            } catch (error) {
                console.log(error)
            }
        },

        exportData() {
            const headers = this.headers;
            const data = this.data;

            // Create worksheet using XLSX.utils.json_to_sheet
            const ws = XLSX.utils.json_to_sheet([headers, ...data], { skipHeader: true });

            // Create workbook and append the worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

            // Save the workbook as an Excel file
            XLSX.writeFile(wb, 'exported_data.xlsx');
        }
    }
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 30px;
    border: none;
    border-radius: 7px;
}

.table-container {
    border: 1px solid black;
    overflow-x: auto;
}
</style>