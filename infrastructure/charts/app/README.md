# Helm Chart Dependencies Notes
#
# This is an umbrella chart that deploys the complete alkfet application stack.
#
# To use this chart:
#
# 1. Update dependencies:
#    helm dependency update infrastructure/charts/app
#
# 2. Install the chart:
#    helm install alkfet infrastructure/charts/app
#
# 3. Or with custom values:
#    helm install alkfet infrastructure/charts/app -f values-custom.yaml
#
# Sub-charts included:
# - backend: NestJS backend service (port 3000)
# - apigateway: Hono API Gateway (port 4000)
# - mcpserver: Model Context Protocol Server (port 4100)
# - frontend: Vue + Nginx frontend (port 80)
#
# Each sub-chart can be disabled by setting enabled: false
# Example: helm install alkfet infrastructure/charts/app --set backend.enabled=false
