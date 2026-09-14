#!/usr/bin/env node
/**
 * 관리자용 사이트의 최신 제품 상세 데이터를 고객용 카탈로그에 동기화한다.
 * 두 프로젝트의 제품 ID가 모두 일치할 때만 실행하며, 고객용 UI/인증 코드는 변경하지 않는다.
 */
import fs from 'node:fs'
import path from 'node:path'

const customerRoot = path.resolve(import.meta.dirname, '..')
const adminRoot = path.resolve(customerRoot, '..', 'allrentaladmin')
const adminProductsPath = path.join(adminRoot, 'public', 'data', 'products.json')
const customerProductsPath = path.join(customerRoot, 'public', 'data', 'products.json')
const reportPath = path.join(customerRoot, 'reports', 'admin-detail-sync.json')

const adminProducts = JSON.parse(fs.readFileSync(adminProductsPath, 'utf8'))
const customerProducts = JSON.parse(fs.readFileSync(customerProductsPath, 'utf8'))
const adminIds = new Set(adminProducts.map(product => product.id))
const customerIds = new Set(customerProducts.map(product => product.id))
const missingInCustomer = [...adminIds].filter(id => !customerIds.has(id))
const missingInAdmin = [...customerIds].filter(id => !adminIds.has(id))

if (missingInCustomer.length || missingInAdmin.length) {
  throw new Error(`product ID mismatch: admin-only=${missingInCustomer.length}, customer-only=${missingInAdmin.length}`)
}

fs.mkdirSync(path.dirname(customerProductsPath), { recursive: true })
fs.copyFileSync(adminProductsPath, customerProductsPath)
const report = {
  syncedAt: new Date().toISOString(),
  products: adminProducts.length,
  productsWithDetailImages: adminProducts.filter(product => product.detail_description_images?.length).length,
  detailImageOrigin: 'https://allrentaladmin.vercel.app/images/details/',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(JSON.stringify(report))
