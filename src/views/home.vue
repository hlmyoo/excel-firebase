<template>
    <header class="masthead">
        <div class="container position-relative">
            <button class="sidebar" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling"
                aria-controls="offcanvasScrolling"><i class="fa-solid fa-bars"></i></button>

            <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1"
                id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasScrollingLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <p><router-link to="/excel">Excel Data</router-link></p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-xl-6">
                    <div class="text-center text-white">
                        <h1 class="mb-5">Dashboard Data</h1>
                        <form class="form-subscribe" id="contactForm">
                            <div class="row">
                                <div class="col">
                                    <input class="form-control form-control-lg" type="file" @change="handleFileChange" />
                                </div>
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <section class="features-icons bg-light text-center">
        <div class="container">
            <div class="table-container">
                <div class="table-wrapper">

                    <table ref="table" class="table table-hover table-stripped">
                        <thead>
                            <tr>
                                <th v-for="header in headers" :key="header">{{ header }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in data" :key="index">
                                <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
// import XLSX from 'xlsx';
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import { db } from '../firebase.js'
import { addDoc, collection } from 'firebase/firestore'

export default {
    name: 'app',
    data() {
        return {
            data: {},
            headers: {},
            fileName: ''
        };
    },
    mounted() {
        console.log(this.headers)
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0];
            this.readExcel(file);
            this.$refs.table.scrollIntoView({ behavior: 'smooth' })
            console.log({ file: file })
            this.fileName = file.name
        },
        readExcel(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                this.headers = this.getHeaders(sheet);
                this.data = this.getData(sheet);
            };
            reader.readAsArrayBuffer(file);
        },
        getHeaders(sheet) {
            const headers = [];
            const range = XLSX.utils.decode_range(sheet["!ref"]);
            for (let j = range.s.c; j <= range.e.c; j++) {
                const cellAddress = { r: range.s.r, c: j };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                const cellValue = sheet[cellRef] ? sheet[cellRef].v : "";
                headers.push(cellValue);
            }
            // this.header = headers
            console.log('Ini Header' + headers)
            return headers;
        },
        getData(sheet) {
            const data = [];
            const range = XLSX.utils.decode_range(sheet["!ref"]);
            for (let i = range.s.r + 1; i <= range.e.r; i++) {
                const row = [];
                for (let j = range.s.c; j <= range.e.c; j++) {
                    const cellAddress = { r: i, c: j };
                    const cellRef = XLSX.utils.encode_cell(cellAddress);
                    const cellValue = sheet[cellRef] ? sheet[cellRef].v : "";
                    row.push(cellValue);
                }
                data.push(row);
            }
            this.saveDataToFirestore(data);
            console.log(data)
            console.log(this.fileName)
            return data;
        },
        async saveDataToFirestore(data) {
            try {
                const tasksCollectionRef = collection(db, 'excel');

                // Membuat objek dokumen untuk menyimpan data dari satu file Excel
                const documentData = {
                    header: this.headers,
                    rows: data.map((row) => ({ ...row })),
                    fileName: this.fileName
                };

                // Menyimpan dokumen ke Firestore, Firebase akan membuat ID secara otomatis
                await addDoc(tasksCollectionRef, documentData);

                console.log('Data saved to Firestore successfully');
            } catch (error) {
                console.error('Error saving data to Firestore:', error);
            }
        },
        exportData() {
            const ws = XLSX.utils.json_to_sheet(this.data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
            XLSX.writeFile(wb, 'exported_data.xlsx');
        },
    },
};
</script>

<style scoped>
table {
    border: 1px solid black;
}

.table-wrapper {
    display: inline-block;
    /* border: 1px solid black; */

}

.table-container {
    border: 1px solid black;
    overflow-y: auto;
    overflow-x: auto;
}

.sidebar {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 30px;
    border: none;
    border-radius: 7px;
}
</style>