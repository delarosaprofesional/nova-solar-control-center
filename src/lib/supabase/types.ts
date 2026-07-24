export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brigadas: {
        Row: {
          estado: string | null
          id: string
          nombre_brigada: string
          notas: string | null
          supervisor_id: string | null
          telefono: string | null
        }
        Insert: {
          estado?: string | null
          id?: string
          nombre_brigada: string
          notas?: string | null
          supervisor_id?: string | null
          telefono?: string | null
        }
        Update: {
          estado?: string | null
          id?: string
          nombre_brigada?: string
          notas?: string | null
          supervisor_id?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_brigadas_supervisor"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_producto: {
        Row: {
          activo: boolean
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          activo: boolean
          direccion: string | null
          email: string | null
          fuente: string | null
          id: string
          nombre_cliente: string
          notas: string | null
          telefono: string | null
          tipo_cliente: string | null
        }
        Insert: {
          activo?: boolean
          direccion?: string | null
          email?: string | null
          fuente?: string | null
          id?: string
          nombre_cliente: string
          notas?: string | null
          telefono?: string | null
          tipo_cliente?: string | null
        }
        Update: {
          activo?: boolean
          direccion?: string | null
          email?: string | null
          fuente?: string | null
          id?: string
          nombre_cliente?: string
          notas?: string | null
          telefono?: string | null
          tipo_cliente?: string | null
        }
        Relationships: []
      }
      compras: {
        Row: {
          archivo_factura_url: string | null
          cantidad: number
          costo_total: number | null
          costo_unitario: number
          estado_pago: string
          estado_validacion: string | null
          fecha: string
          fecha_registro: string
          id: string
          metodo_pago: string
          notas: string | null
          numero_factura: string | null
          producto_id: string
          proveedor_id: string | null
          registrado_por_id: string | null
          ubicacion_entrada_id: string | null
        }
        Insert: {
          archivo_factura_url?: string | null
          cantidad: number
          costo_total?: number | null
          costo_unitario: number
          estado_pago: string
          estado_validacion?: string | null
          fecha?: string
          fecha_registro?: string
          id?: string
          metodo_pago: string
          notas?: string | null
          numero_factura?: string | null
          producto_id: string
          proveedor_id?: string | null
          registrado_por_id?: string | null
          ubicacion_entrada_id?: string | null
        }
        Update: {
          archivo_factura_url?: string | null
          cantidad?: number
          costo_total?: number | null
          costo_unitario?: number
          estado_pago?: string
          estado_validacion?: string | null
          fecha?: string
          fecha_registro?: string
          id?: string
          metodo_pago?: string
          notas?: string | null
          numero_factura?: string | null
          producto_id?: string
          proveedor_id?: string | null
          registrado_por_id?: string | null
          ubicacion_entrada_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_ubicacion_entrada_id_fkey"
            columns: ["ubicacion_entrada_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion: {
        Row: {
          activo: boolean
          id: string
          nombre_parametro: string
          notas: string | null
          valor_numero: number | null
          valor_texto: string | null
        }
        Insert: {
          activo?: boolean
          id?: string
          nombre_parametro: string
          notas?: string | null
          valor_numero?: number | null
          valor_texto?: string | null
        }
        Update: {
          activo?: boolean
          id?: string
          nombre_parametro?: string
          notas?: string | null
          valor_numero?: number | null
          valor_texto?: string | null
        }
        Relationships: []
      }
      gastos: {
        Row: {
          categoria: string
          descripcion: string
          estado_validacion: string | null
          fecha: string
          id: string
          metodo_pago: string
          monto: number
          notas: string | null
          orden_relacionada_id: string | null
          proveedor_id: string | null
          recibo_url: string | null
          registrado_por_id: string | null
          subcategoria: string | null
        }
        Insert: {
          categoria: string
          descripcion: string
          estado_validacion?: string | null
          fecha?: string
          id?: string
          metodo_pago: string
          monto: number
          notas?: string | null
          orden_relacionada_id?: string | null
          proveedor_id?: string | null
          recibo_url?: string | null
          registrado_por_id?: string | null
          subcategoria?: string | null
        }
        Update: {
          categoria?: string
          descripcion?: string
          estado_validacion?: string | null
          fecha?: string
          id?: string
          metodo_pago?: string
          monto?: number
          notas?: string | null
          orden_relacionada_id?: string | null
          proveedor_id?: string | null
          recibo_url?: string | null
          registrado_por_id?: string | null
          subcategoria?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_orden_relacionada_id_fkey"
            columns: ["orden_relacionada_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_actual: {
        Row: {
          costo_promedio: number
          disponible: number | null
          entradas: number
          estado_stock: string | null
          producto_id: string
          reservado: number
          salidas: number
          stock_minimo: number
          ubicacion_id: string
          valor_disponible: number | null
        }
        Insert: {
          costo_promedio?: number
          disponible?: number | null
          entradas?: number
          estado_stock?: string | null
          producto_id: string
          reservado?: number
          salidas?: number
          stock_minimo?: number
          ubicacion_id: string
          valor_disponible?: number | null
        }
        Update: {
          costo_promedio?: number
          disponible?: number | null
          entradas?: number
          estado_stock?: string | null
          producto_id?: string
          reservado?: number
          salidas?: number
          stock_minimo?: number
          ubicacion_id?: string
          valor_disponible?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_actual_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_actual_ubicacion_id_fkey"
            columns: ["ubicacion_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      materiales_orden: {
        Row: {
          cantidad_asignada: number
          cantidad_devuelta: number | null
          cantidad_utilizada: number | null
          costo_total_asignado: number | null
          costo_total_utilizado: number | null
          costo_unitario: number
          estado_material: string | null
          fecha: string
          id: string
          notas: string | null
          orden_id: string
          precio_total_cliente: number | null
          precio_unitario_cliente: number | null
          producto_id: string
          responsable_id: string | null
          ubicacion_salida_id: string
          utilidad_linea: number | null
        }
        Insert: {
          cantidad_asignada: number
          cantidad_devuelta?: number | null
          cantidad_utilizada?: number | null
          costo_total_asignado?: number | null
          costo_total_utilizado?: number | null
          costo_unitario?: number
          estado_material?: string | null
          fecha?: string
          id?: string
          notas?: string | null
          orden_id: string
          precio_total_cliente?: number | null
          precio_unitario_cliente?: number | null
          producto_id: string
          responsable_id?: string | null
          ubicacion_salida_id: string
          utilidad_linea?: number | null
        }
        Update: {
          cantidad_asignada?: number
          cantidad_devuelta?: number | null
          cantidad_utilizada?: number | null
          costo_total_asignado?: number | null
          costo_total_utilizado?: number | null
          costo_unitario?: number
          estado_material?: string | null
          fecha?: string
          id?: string
          notas?: string | null
          orden_id?: string
          precio_total_cliente?: number | null
          precio_unitario_cliente?: number | null
          producto_id?: string
          responsable_id?: string | null
          ubicacion_salida_id?: string
          utilidad_linea?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "materiales_orden_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiales_orden_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiales_orden_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiales_orden_ubicacion_salida_id_fkey"
            columns: ["ubicacion_salida_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_inventario: {
        Row: {
          cantidad: number
          costo_total: number | null
          costo_unitario: number
          fecha: string
          id: string
          notas: string | null
          producto_id: string
          referencia: string | null
          responsable_id: string | null
          tipo_movimiento: string
          tipo_referencia: string | null
          ubicacion_destino_id: string | null
          ubicacion_origen_id: string | null
        }
        Insert: {
          cantidad: number
          costo_total?: number | null
          costo_unitario: number
          fecha?: string
          id?: string
          notas?: string | null
          producto_id: string
          referencia?: string | null
          responsable_id?: string | null
          tipo_movimiento: string
          tipo_referencia?: string | null
          ubicacion_destino_id?: string | null
          ubicacion_origen_id?: string | null
        }
        Update: {
          cantidad?: number
          costo_total?: number | null
          costo_unitario?: number
          fecha?: string
          id?: string
          notas?: string | null
          producto_id?: string
          referencia?: string | null
          responsable_id?: string | null
          tipo_movimiento?: string
          tipo_referencia?: string | null
          ubicacion_destino_id?: string | null
          ubicacion_origen_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_inventario_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_inventario_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_inventario_ubicacion_destino_id_fkey"
            columns: ["ubicacion_destino_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_inventario_ubicacion_origen_id_fkey"
            columns: ["ubicacion_origen_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_trabajo: {
        Row: {
          brigada_asignada_id: string | null
          cerrado_por_id: string | null
          cliente_id: string
          contrato_comprobante_url: string | null
          costo_mano_obra: number | null
          costo_materiales_estimado: number | null
          costo_materiales_real: number | null
          costo_total: number | null
          creado_por_id: string | null
          direccion_trabajo: string
          estado: string
          estado_cobro: string | null
          fecha_creacion: string
          fecha_inicio: string | null
          fecha_programada: string | null
          fecha_terminada: string | null
          fotos_cierre_url: string | null
          id: string
          kit_contratado_id: string | null
          notas: string | null
          otros_costos: number | null
          precio_cobrado: number | null
          telefono: string | null
          tipo_instalacion: string
          utilidad_real: number | null
        }
        Insert: {
          brigada_asignada_id?: string | null
          cerrado_por_id?: string | null
          cliente_id: string
          contrato_comprobante_url?: string | null
          costo_mano_obra?: number | null
          costo_materiales_estimado?: number | null
          costo_materiales_real?: number | null
          costo_total?: number | null
          creado_por_id?: string | null
          direccion_trabajo: string
          estado?: string
          estado_cobro?: string | null
          fecha_creacion?: string
          fecha_inicio?: string | null
          fecha_programada?: string | null
          fecha_terminada?: string | null
          fotos_cierre_url?: string | null
          id?: string
          kit_contratado_id?: string | null
          notas?: string | null
          otros_costos?: number | null
          precio_cobrado?: number | null
          telefono?: string | null
          tipo_instalacion: string
          utilidad_real?: number | null
        }
        Update: {
          brigada_asignada_id?: string | null
          cerrado_por_id?: string | null
          cliente_id?: string
          contrato_comprobante_url?: string | null
          costo_mano_obra?: number | null
          costo_materiales_estimado?: number | null
          costo_materiales_real?: number | null
          costo_total?: number | null
          creado_por_id?: string | null
          direccion_trabajo?: string
          estado?: string
          estado_cobro?: string | null
          fecha_creacion?: string
          fecha_inicio?: string | null
          fecha_programada?: string | null
          fecha_terminada?: string | null
          fotos_cierre_url?: string | null
          id?: string
          kit_contratado_id?: string | null
          notas?: string | null
          otros_costos?: number | null
          precio_cobrado?: number | null
          telefono?: string | null
          tipo_instalacion?: string
          utilidad_real?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_trabajo_brigada_asignada_id_fkey"
            columns: ["brigada_asignada_id"]
            isOneToOne: false
            referencedRelation: "brigadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_trabajo_cerrado_por_id_fkey"
            columns: ["cerrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_trabajo_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_trabajo_creado_por_id_fkey"
            columns: ["creado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordenes_trabajo_kit_contratado_id_fkey"
            columns: ["kit_contratado_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_brigadas: {
        Row: {
          brigada_id: string | null
          comprobante_url: string | null
          estado_pago: string
          fecha: string
          fecha_pago: string | null
          id: string
          metodo_pago: string
          monto: number
          notas: string | null
          orden_id: string
          registrado_por_id: string | null
          trabajador_id: string | null
        }
        Insert: {
          brigada_id?: string | null
          comprobante_url?: string | null
          estado_pago: string
          fecha?: string
          fecha_pago?: string | null
          id?: string
          metodo_pago: string
          monto: number
          notas?: string | null
          orden_id: string
          registrado_por_id?: string | null
          trabajador_id?: string | null
        }
        Update: {
          brigada_id?: string | null
          comprobante_url?: string | null
          estado_pago?: string
          fecha?: string
          fecha_pago?: string | null
          id?: string
          metodo_pago?: string
          monto?: number
          notas?: string | null
          orden_id?: string
          registrado_por_id?: string | null
          trabajador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_brigadas_brigada_id_fkey"
            columns: ["brigada_id"]
            isOneToOne: false
            referencedRelation: "brigadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_brigadas_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_brigadas_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_brigadas_trabajador_id_fkey"
            columns: ["trabajador_id"]
            isOneToOne: false
            referencedRelation: "trabajadores"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          activo: boolean
          categoria_id: string
          costo_promedio: number | null
          id: string
          marca: string | null
          modelo: string | null
          nombre_producto: string
          notas: string | null
          precio_sugerido: number | null
          sku: string | null
          stock_minimo: number
          tipo_producto: string
          unidad_medida: string
        }
        Insert: {
          activo?: boolean
          categoria_id: string
          costo_promedio?: number | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nombre_producto: string
          notas?: string | null
          precio_sugerido?: number | null
          sku?: string | null
          stock_minimo?: number
          tipo_producto: string
          unidad_medida: string
        }
        Update: {
          activo?: boolean
          categoria_id?: string
          costo_promedio?: number | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nombre_producto?: string
          notas?: string | null
          precio_sugerido?: number | null
          sku?: string | null
          stock_minimo?: number
          tipo_producto?: string
          unidad_medida?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_producto"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedores: {
        Row: {
          activo: boolean
          condiciones_pago: string | null
          contacto: string | null
          direccion: string | null
          email: string | null
          id: string
          nombre_proveedor: string
          notas: string | null
          telefono: string | null
        }
        Insert: {
          activo?: boolean
          condiciones_pago?: string | null
          contacto?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre_proveedor: string
          notas?: string | null
          telefono?: string | null
        }
        Update: {
          activo?: boolean
          condiciones_pago?: string | null
          contacto?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre_proveedor?: string
          notas?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          activo: boolean
          descripcion: string | null
          id: string
          nombre_rol: string
        }
        Insert: {
          activo?: boolean
          descripcion?: string | null
          id?: string
          nombre_rol: string
        }
        Update: {
          activo?: boolean
          descripcion?: string | null
          id?: string
          nombre_rol?: string
        }
        Relationships: []
      }
      trabajadores: {
        Row: {
          brigada_id: string | null
          estado: string | null
          id: string
          nombre: string
          notas: string | null
          rol_trabajo: string | null
          telefono: string | null
          tipo_pago: string | null
        }
        Insert: {
          brigada_id?: string | null
          estado?: string | null
          id?: string
          nombre: string
          notas?: string | null
          rol_trabajo?: string | null
          telefono?: string | null
          tipo_pago?: string | null
        }
        Update: {
          brigada_id?: string | null
          estado?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          rol_trabajo?: string | null
          telefono?: string | null
          tipo_pago?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trabajadores_brigada_id_fkey"
            columns: ["brigada_id"]
            isOneToOne: false
            referencedRelation: "brigadas"
            referencedColumns: ["id"]
          },
        ]
      }
      ubicaciones: {
        Row: {
          activa: boolean
          direccion: string | null
          id: string
          nombre_ubicacion: string
          notas: string | null
          responsable_id: string | null
          tipo_ubicacion: string
        }
        Insert: {
          activa?: boolean
          direccion?: string | null
          id?: string
          nombre_ubicacion: string
          notas?: string | null
          responsable_id?: string | null
          tipo_ubicacion: string
        }
        Update: {
          activa?: boolean
          direccion?: string | null
          id?: string
          nombre_ubicacion?: string
          notas?: string | null
          responsable_id?: string | null
          tipo_ubicacion?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ubicaciones_responsable"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          activo: boolean
          auth_user_id: string | null
          brigada_asignada_id: string | null
          email: string
          fecha_creacion: string
          id: string
          nombre: string
          notas: string | null
          rol_id: string
          ubicacion_asignada_id: string | null
        }
        Insert: {
          activo?: boolean
          auth_user_id?: string | null
          brigada_asignada_id?: string | null
          email: string
          fecha_creacion?: string
          id?: string
          nombre: string
          notas?: string | null
          rol_id: string
          ubicacion_asignada_id?: string | null
        }
        Update: {
          activo?: boolean
          auth_user_id?: string | null
          brigada_asignada_id?: string | null
          email?: string
          fecha_creacion?: string
          id?: string
          nombre?: string
          notas?: string | null
          rol_id?: string
          ubicacion_asignada_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_brigada_asignada_id_fkey"
            columns: ["brigada_asignada_id"]
            isOneToOne: false
            referencedRelation: "brigadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_ubicacion_asignada_id_fkey"
            columns: ["ubicacion_asignada_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      ventas_tienda: {
        Row: {
          cantidad: number
          cliente_id: string
          comprobante_pago_url: string | null
          costo_total: number | null
          costo_unitario: number
          estado_validacion: string | null
          fecha: string
          id: string
          margen_bruto: number | null
          metodo_pago: string
          notas: string | null
          precio_unitario: number
          producto_id: string
          punto_venta_id: string | null
          registrado_por_id: string | null
          total_venta: number | null
          utilidad_bruta: number | null
          vendedor_id: string | null
        }
        Insert: {
          cantidad: number
          cliente_id: string
          comprobante_pago_url?: string | null
          costo_total?: number | null
          costo_unitario?: number
          estado_validacion?: string | null
          fecha?: string
          id?: string
          margen_bruto?: number | null
          metodo_pago: string
          notas?: string | null
          precio_unitario: number
          producto_id: string
          punto_venta_id?: string | null
          registrado_por_id?: string | null
          total_venta?: number | null
          utilidad_bruta?: number | null
          vendedor_id?: string | null
        }
        Update: {
          cantidad?: number
          cliente_id?: string
          comprobante_pago_url?: string | null
          costo_total?: number | null
          costo_unitario?: number
          estado_validacion?: string | null
          fecha?: string
          id?: string
          margen_bruto?: number | null
          metodo_pago?: string
          notas?: string | null
          precio_unitario?: number
          producto_id?: string
          punto_venta_id?: string | null
          registrado_por_id?: string | null
          total_venta?: number | null
          utilidad_bruta?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ventas_tienda_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_tienda_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_tienda_punto_venta_id_fkey"
            columns: ["punto_venta_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_tienda_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_tienda_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      compras_con_alertas: {
        Row: {
          alerta_factura_pendiente: boolean | null
          archivo_factura_url: string | null
          cantidad: number | null
          costo_total: number | null
          costo_unitario: number | null
          estado_pago: string | null
          estado_validacion: string | null
          fecha: string | null
          fecha_registro: string | null
          id: string | null
          metodo_pago: string | null
          notas: string | null
          numero_factura: string | null
          producto_id: string | null
          proveedor_id: string | null
          registrado_por_id: string | null
          ubicacion_entrada_id: string | null
        }
        Insert: {
          alerta_factura_pendiente?: never
          archivo_factura_url?: string | null
          cantidad?: number | null
          costo_total?: number | null
          costo_unitario?: number | null
          estado_pago?: string | null
          estado_validacion?: string | null
          fecha?: string | null
          fecha_registro?: string | null
          id?: string | null
          metodo_pago?: string | null
          notas?: string | null
          numero_factura?: string | null
          producto_id?: string | null
          proveedor_id?: string | null
          registrado_por_id?: string | null
          ubicacion_entrada_id?: string | null
        }
        Update: {
          alerta_factura_pendiente?: never
          archivo_factura_url?: string | null
          cantidad?: number | null
          costo_total?: number | null
          costo_unitario?: number | null
          estado_pago?: string | null
          estado_validacion?: string | null
          fecha?: string | null
          fecha_registro?: string | null
          id?: string | null
          metodo_pago?: string | null
          notas?: string | null
          numero_factura?: string | null
          producto_id?: string | null
          proveedor_id?: string | null
          registrado_por_id?: string | null
          ubicacion_entrada_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_ubicacion_entrada_id_fkey"
            columns: ["ubicacion_entrada_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos_con_alertas: {
        Row: {
          alerta_recibo_pendiente: boolean | null
          categoria: string | null
          descripcion: string | null
          estado_validacion: string | null
          fecha: string | null
          id: string | null
          metodo_pago: string | null
          monto: number | null
          notas: string | null
          orden_relacionada_id: string | null
          proveedor_id: string | null
          recibo_url: string | null
          registrado_por_id: string | null
          subcategoria: string | null
        }
        Insert: {
          alerta_recibo_pendiente?: never
          categoria?: string | null
          descripcion?: string | null
          estado_validacion?: string | null
          fecha?: string | null
          id?: string | null
          metodo_pago?: string | null
          monto?: number | null
          notas?: string | null
          orden_relacionada_id?: string | null
          proveedor_id?: string | null
          recibo_url?: string | null
          registrado_por_id?: string | null
          subcategoria?: string | null
        }
        Update: {
          alerta_recibo_pendiente?: never
          categoria?: string | null
          descripcion?: string | null
          estado_validacion?: string | null
          fecha?: string | null
          id?: string | null
          metodo_pago?: string | null
          monto?: number | null
          notas?: string | null
          orden_relacionada_id?: string | null
          proveedor_id?: string | null
          recibo_url?: string | null
          registrado_por_id?: string | null
          subcategoria?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_orden_relacionada_id_fkey"
            columns: ["orden_relacionada_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_registrado_por_id_fkey"
            columns: ["registrado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_critico: {
        Row: {
          costo_promedio: number | null
          disponible: number | null
          entradas: number | null
          estado_stock: string | null
          producto_id: string | null
          reservado: number | null
          salidas: number | null
          stock_minimo: number | null
          ubicacion_id: string | null
          valor_disponible: number | null
        }
        Insert: {
          costo_promedio?: number | null
          disponible?: number | null
          entradas?: number | null
          estado_stock?: string | null
          producto_id?: string | null
          reservado?: number | null
          salidas?: number | null
          stock_minimo?: number | null
          ubicacion_id?: string | null
          valor_disponible?: number | null
        }
        Update: {
          costo_promedio?: number | null
          disponible?: number | null
          entradas?: number | null
          estado_stock?: string | null
          producto_id?: string | null
          reservado?: number | null
          salidas?: number | null
          stock_minimo?: number | null
          ubicacion_id?: string | null
          valor_disponible?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_actual_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_actual_ubicacion_id_fkey"
            columns: ["ubicacion_id"]
            isOneToOne: false
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      fn_brigada_actual: { Args: never; Returns: string }
      fn_config_valor: { Args: { p_nombre_parametro: string }; Returns: number }
      fn_dashboard_metricas: {
        Args: never
        Returns: {
          compras_totales: number
          gastos_totales: number
          ingresos_ventas_tienda: number
          ordenes_activas: number
          ordenes_terminadas: number
          pagos_brigadas_pendientes_conteo: number
          pagos_brigadas_pendientes_monto: number
        }[]
      }
      fn_rol_actual: { Args: never; Returns: string }
      fn_ubicacion_actual: { Args: never; Returns: string }
      fn_usuario_actual: {
        Args: never
        Returns: {
          activo: boolean
          auth_user_id: string | null
          brigada_asignada_id: string | null
          email: string
          fecha_creacion: string
          id: string
          nombre: string
          notas: string | null
          rol_id: string
          ubicacion_asignada_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "usuarios"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      gen_id: { Args: { prefijo: string }; Returns: string }
      registrar_movimiento_inventario: {
        Args: {
          p_cantidad: number
          p_cantidad_reserva_liberar?: number
          p_costo_unitario: number
          p_notas: string
          p_producto_id: string
          p_referencia: string
          p_responsable_id: string
          p_tipo_movimiento: string
          p_tipo_referencia: string
          p_ubicacion_destino_id: string
          p_ubicacion_origen_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
