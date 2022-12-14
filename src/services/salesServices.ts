import { Sales, PrismaClient } from "@prisma/client";
import { SalesByCategory } from "../models/productsModel"

const prisma: PrismaClient = new PrismaClient();

export const getSalesDay = async (initial: string): Promise<Sales[]> => {
    return await prisma.$queryRaw`select * from sales s where create_at > ${initial} order by create_at desc`;
}

export const getSalesBetween = async (initial: string, finish: string): Promise<Sales[]> => {
    return await prisma.$queryRaw`select * from sales s where create_at between ${initial} and ${finish} order by create_at desc`;
}

export const getSale = async (id: bigint): Promise<Sales[]> => {
    return await prisma.sales.findMany({
        where: {
            id
        }
    });
}

export const createSale = async (active: boolean): Promise<Sales> => {
    return await prisma.sales.create({
        data: {
            active,
            payment: 0,
            create_at: new Date(),
            update_at: new Date()
        }
    });
}

export const cancelSale = async (id: number, active: boolean): Promise<Sales>  => {
    return await prisma.sales.update({
        data: {
            active,
            update_at: new Date()
        },
        where: {
            id
        }
    });
}

export const updatePayment = async (id: bigint, payment: number, total: number): Promise<Sales>  => {
    return await prisma.sales.update({
        data: {
            payment,
            total,
            update_at: new Date()
        },
        where: {
            id,
        }
    });
}

export const salesByCategory = async (initial: string): Promise<SalesByCategory[]> => {
    return await prisma.$queryRaw`SELECT c.name, sum(pos.total) as total from products_on_sales pos 
    inner join sales s on pos.saleId = s.id 
    inner join products p on pos.productId = p.id
    inner join categories c on p.categoryId = c.id
    where s.create_at > ${initial}
    and s.active = 1
    and pos.active = 1
    GROUP by c.name`;
}

export const salesByCategoryDateBetween = async (initial: string, finish: string): Promise<SalesByCategory[]> => {
    return await prisma.$queryRaw`SELECT c.name, sum(pos.total) as total from products_on_sales pos 
    inner join sales s on pos.saleId = s.id 
    inner join products p on pos.productId = p.id
    inner join categories c on p.categoryId = c.id
    where s.create_at BETWEEN  ${initial} and ${finish}
    and s.active = 1
    and pos.active = 1
    GROUP by c.name`;
}

export const lastSale = async ():Promise<Sales[]>  => {
    return await prisma.$queryRaw`SELECT  payment, total  from sales s where active = 1 order by id DESC limit 1`;
}