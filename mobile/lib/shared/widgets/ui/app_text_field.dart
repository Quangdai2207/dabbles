import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Redesigned premium themed text field with animations and soft aesthetics
class AppTextField extends StatefulWidget {
  const AppTextField({
    required this.controller,
    required this.hint,
    this.label,
    this.prefixIcon,
    super.key,
    this.onChanged,
    this.keyboardType,
    this.obscureText = false,
    this.suffixIcon,
    this.errorMessage,
    this.textCapitalization = TextCapitalization.none,
    this.inputFormatters,
    this.readOnly = false,
    this.onTap,
  });

  final TextEditingController controller;
  final String? label;
  final String hint;
  final IconData? prefixIcon;
  final void Function(String)? onChanged;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? suffixIcon;
  final String? errorMessage;
  final TextCapitalization textCapitalization;
  final List<TextInputFormatter>? inputFormatters;
  final bool readOnly;
  final VoidCallback? onTap;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField>
    with SingleTickerProviderStateMixin {
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;
  late AnimationController _animationController;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );

    _glowAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );

    _focusNode.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
      if (_isFocused) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    });
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    _focusNode.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final bool hasError = widget.errorMessage != null;

    final Color labelColor = hasError
        ? colorScheme.error
        : _isFocused
        ? colorScheme.primary
        : colorScheme.onSurfaceVariant;

    final Color borderColor = hasError
        ? colorScheme.error
        : _isFocused
        ? colorScheme.primary
        : colorScheme.outline;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        if (widget.label != null)
          AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: theme.textTheme.labelMedium!.copyWith(
              fontWeight: FontWeight.w900,
              color: labelColor,
              fontSize: 14,
            ),
            child: Text(widget.label!),
          ),
        if (widget.label != null) const SizedBox(height: 10),
        AnimatedBuilder(
          animation: _glowAnimation,
          builder: (BuildContext context, Widget? child) {
            return DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: <BoxShadow>[
                  BoxShadow(
                    color: colorScheme.primary.withValues(
                      alpha: 0.1 * _glowAnimation.value,
                    ),
                    blurRadius: 12 * _glowAnimation.value,
                    spreadRadius: 2 * _glowAnimation.value,
                  ),
                ],
              ),
              child: child,
            );
          },
          child: TextField(
            controller: widget.controller,
            focusNode: _focusNode,
            keyboardType: widget.keyboardType,
            obscureText: widget.obscureText,
            onChanged: widget.onChanged,
            textCapitalization: widget.textCapitalization,
            inputFormatters: widget.inputFormatters,
            readOnly: widget.readOnly,
            onTap: widget.onTap,
            style: theme.textTheme.bodyMedium?.copyWith(fontSize: 15),
            decoration: InputDecoration(
              hintText: widget.hint,
              hintStyle: theme.textTheme.labelMedium?.copyWith(fontSize: 13),
              prefixIcon: widget.prefixIcon != null
                  ? AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      child: Icon(
                        widget.prefixIcon,
                        color: labelColor,
                        size: 22,
                      ),
                    )
                  : null,
              suffixIcon: widget.suffixIcon,
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
                borderSide: BorderSide(color: borderColor),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
                borderSide: BorderSide(
                  color: hasError ? colorScheme.error : colorScheme.primary,
                  width: 2,
                ),
              ),
            ),
          ),
        ),
        if (hasError) ...<Widget>[
          const SizedBox(height: 6),
          Text(
            widget.errorMessage!,
            style: theme.textTheme.labelSmall?.copyWith(
              color: colorScheme.error,
              fontSize: 12,
            ),
          ),
        ],
      ],
    );
  }
}
