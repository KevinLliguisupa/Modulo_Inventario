
CREATE SEQUENCE public.categoria_cat_id_seq;

CREATE TABLE public.categoria (
                cat_id INTEGER NOT NULL DEFAULT nextval('public.categoria_cat_id_seq'),
                cat_nombre VARCHAR NOT NULL,
                CONSTRAINT categoria_pk PRIMARY KEY (cat_id)
);


ALTER SEQUENCE public.categoria_cat_id_seq OWNED BY public.categoria.cat_id;

CREATE SEQUENCE public.ajuste_aju_id_seq;

CREATE TABLE public.ajuste (
                aju_id INTEGER NOT NULL DEFAULT nextval('public.ajuste_aju_id_seq'),
                aju_numero VARCHAR NOT NULL,
                aju_fecha DATE NOT NULL,
                aju_descripcion VARCHAR NOT NULL,
                CONSTRAINT ajuste_pk PRIMARY KEY (aju_id)
);


ALTER SEQUENCE public.ajuste_aju_id_seq OWNED BY public.ajuste.aju_id;

CREATE SEQUENCE public.producto_pro_id_seq;

CREATE TABLE public.producto (
                pro_id INTEGER NOT NULL DEFAULT nextval('public.producto_pro_id_seq'),
                pro_nombre VARCHAR NOT NULL,
                pro_descripcion VARCHAR NOT NULL,
                cat_id INTEGER NOT NULL,
                pro_iva BOOLEAN NOT NULL,
                pro_costo NUMERIC(7,2) NOT NULL,
                pro_pvp NUMERIC(7,2) NOT NULL,
                pro_stock INTEGER NOT NULL,
                pro_imagen VARCHAR NOT NULL,
                pro_estado BOOLEAN NOT NULL,
                CONSTRAINT producto_pk PRIMARY KEY (pro_id)
);


ALTER SEQUENCE public.producto_pro_id_seq OWNED BY public.producto.pro_id;

CREATE SEQUENCE public.ajuste_detalle_aju_det_id_seq;

CREATE TABLE public.ajuste_detalle (
                aju_det_id INTEGER NOT NULL DEFAULT nextval('public.ajuste_detalle_aju_det_id_seq'),
                aju_id INTEGER NOT NULL,
                pro_id INTEGER NOT NULL,
                aju_det_cantidad NUMERIC(7) NOT NULL,
                CONSTRAINT ajuste_detalle_pk PRIMARY KEY (aju_det_id)
);


ALTER SEQUENCE public.ajuste_detalle_aju_det_id_seq OWNED BY public.ajuste_detalle.aju_det_id;

ALTER TABLE public.producto ADD CONSTRAINT categoria_producto_fk
FOREIGN KEY (cat_id)
REFERENCES public.categoria (cat_id)
ON DELETE NO ACTION
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE public.ajuste_detalle ADD CONSTRAINT ajuste_ajuste_detalle_fk
FOREIGN KEY (aju_id)
REFERENCES public.ajuste (aju_id)
ON DELETE NO ACTION
ON UPDATE CASCADE
NOT DEFERRABLE;

ALTER TABLE public.ajuste_detalle ADD CONSTRAINT producto_ajuste_detalle_fk
FOREIGN KEY (pro_id)
REFERENCES public.producto (pro_id)
ON DELETE NO ACTION
ON UPDATE CASCADE
NOT DEFERRABLE;
