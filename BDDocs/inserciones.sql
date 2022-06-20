--Categorias
insert into categoria (cat_nombre, cat_estado) values ('Frutas', true);
insert into categoria (cat_nombre, cat_estado) values ('Jugos', true);
insert into categoria (cat_nombre, cat_estado) values ('Lacteos', true);
insert into categoria (cat_nombre, cat_estado) values ('Bebidas alcoholicas', true);
insert into categoria (cat_nombre, cat_estado) values ('Helados', true);
insert into categoria (cat_nombre, cat_estado) values ('Verduras', true);
insert into categoria (cat_nombre, cat_estado) values ('Aceites', true);
insert into categoria (cat_nombre, cat_estado) values ('Chocolates', true);
insert into categoria (cat_nombre, cat_estado) values ('Snacks', true);
insert into categoria (cat_nombre, cat_estado) values ('Fideos', true);
insert into categoria (cat_nombre, cat_estado) values ('Embutidos', true);
insert into categoria (cat_nombre, cat_estado) values ('Productos de aseo', true);

--Producto
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Switch', 'Switch+flow es un licor ecuatoriano', 4, true, 2.40, 2.95, 'https://static.wixstatic.com/media/7030ae_8de783c8f4cc449ab8d6f297745f53ee~mv2.png/v1/fill/w_560,h_472,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Switch_productos_nuevo.png', true);
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Coca Cola', 'Bebida gaseosa 1L', 2, true, 1.00, 1.30, 'https://licoreschullavida.com/wp-content/uploads/2020/07/Coca-cola-1-litro.jpg',true);
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Mortadela Plumrose', 'Mortadela tipo II', 11, true, 0.75, 0.99, 'https://www.plumrose.com.ec/images/virtuemart/product/Mortadela%20170g.png',true);
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Pizzerolas', 'Tostitos sabor a Pizza', 9, true, 0.48, 0.60, 'https://frontline.la/wp-content/uploads/2021/05/pizzerolas45gr-e1634665906749.jpg',true);
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Uvas', 'Uvas verdes', 1, true, 2.00, 2.50, 'https://unisima.com/wp-content/uploads/2014/07/uva-verde-1.jpg',true);
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Toni Griego', 'Yogurt Toni Griego', 3, true, 1.17, 1.30, 'http://www.tonicorp.com/img/productos-2/yogurt-toni-griego/yogurt-toni-griego-natural.png',true);
INSERT INTO producto (pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado) VALUES ('Brócoli', 'Brócoli pequeño', 6, true, 0.40, 0.75, 'https://elpoderdelconsumidor.org/wp-content/uploads/2016/11/brocoli.jpg',true);

--Ajuste
INSERT INTO ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)	VALUES ('AJUS-00001', '1/3/2022', 'Productos fuera de stock', true);
INSERT INTO ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)	VALUES ('AJUS-00002', '2/4/2022', 'Compra anticipada', true);
INSERT INTO ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)	VALUES ('AJUS-00003', '1/2/2022', 'Devolucion de producto', true);
INSERT INTO ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)	VALUES ('AJUS-00004', '4/6/2022', 'Garantia por caducidad', true);
INSERT INTO ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)	VALUES ('AJUS-00005', '5/5/2022', 'Compra anticipada', true);
INSERT INTO ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)	VALUES ('AJUS-00006', '3/4/2022', 'Devolucion por parte de cliente', true);

--Detalle ajsute
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00001', 1, 20, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00001', 2, 18, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00002', 4, 6, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00003', 5, 10, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00003', 2, 15, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00004', 3, 9, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00005', 7, 8, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00005', 3, 12, true, true);
INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, aju_det_modificable, aju_det_estado) VALUES ('AJUS-00006', 6, 5, true, true);

