# Calculadora de Amortización de Crédito Francés

Esta aplicación web permite calcular la tabla de amortización para un crédito con el sistema francés, que utiliza pagos fijos mensuales y una tasa de interés fija.

## Características

- Cálculo de la tabla de amortización completa
- Simulación de pagos extra para reducir la duración del crédito
- Simulación de pagos extra para reducir el pago mensual manteniendo la misma duración
- Visualización del ahorro en intereses

## Cómo usar

1. Ingrese el monto del préstamo en UF (Unidad de Fomento)
2. Ingrese la tasa de interés anual como porcentaje
3. Ingrese la duración en meses
4. Haga clic en "Calcular" para ver la tabla de amortización básica

### Simulación de Pago Extra

Para simular un pago extra:

1. Ingrese el monto del pago extra en UF
2. Ingrese el mes en que desea realizar el pago extra
3. Seleccione una de las dos opciones:
   - **Reducir Duración**: Mantiene el mismo pago mensual y reduce la duración del crédito
   - **Reducir Pago**: Mantiene la misma duración y reduce el pago mensual
4. Haga clic en "Calcular con Pago Extra"

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript

## Instalación

No requiere instalación. Simplemente abra el archivo `index.html` en cualquier navegador web moderno.

## Notas

- Esta calculadora utiliza el sistema de amortización francés, donde los pagos mensuales son constantes
- Los cálculos se realizan en el navegador, no se envían datos a ningún servidor
- Los montos se muestran en UF (Unidad de Fomento) con formato chileno (usando coma como separador decimal) 