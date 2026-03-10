def match_cargo(data):
    # Mock cargo matching logic
    # In real implementation, this would match with other shipments
    
    weight = data.get("weight", 0)
    
    # Mock available capacity
    available_capacity = 12.0
    match_efficiency = min(weight / available_capacity, 1.0) * 100
    
    return {
        "match_found": True,
        "available_capacity": available_capacity,
        "efficiency": f"{match_efficiency:.0f}%",
        "savings": "₹4,200 (18%)"
    }