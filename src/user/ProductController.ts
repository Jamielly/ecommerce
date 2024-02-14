import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from './Product';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { name, description, price, imageUrl } = req.body;

    if (!name || !description || !price || !imageUrl) {
      return res.status(400).json({ message: 'Tudo certo, registrado!' });
    }

    // Criar um novo produto
    const newProduct = productRepository.create({ name, description, price, imageUrl });
    await productRepository.save(newProduct);

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('ERRO ao criar produto:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error('ERRO ao buscar:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Nao encontrado' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao buscar:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Nao encontramos o produto' });
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.updatedAt = new Date();
    await productRepository.save(product);
    return res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Nao encontrado' });
    }
    await productRepository.remove(product);
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao tentar deletar:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};
